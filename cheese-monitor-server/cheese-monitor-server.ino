#include <WiFi.h>
#include <OneWire.h>
#include <DallasTemperature.h>
#include <ArduinoJson.h>
#include "aWOT.h"
#include "StaticFiles.h"
#include "credentials.h"

#define NUM_LAMPS   2
#define LAMP_0_PIN  25
#define LAMP_1_PIN  33
#define TMP_PIN     32

WiFiServer server(80);
Application app;
OneWire oneWire(TMP_PIN);
DallasTemperature temp(&oneWire); // Thermometer

StaticJsonDocument<200> req_doc;
StaticJsonDocument<200> res_doc;
char authorization[100];

// Peripheral interaction
void init_lamps()
{
  pinMode(LAMP_0_PIN, OUTPUT);
  pinMode(LAMP_1_PIN, OUTPUT);
}

int get_lamp(int lamp) {
  int pin = LAMP_0_PIN;
  if (lamp == 1)
    pin = LAMP_1_PIN;
  return digitalRead(pin);
}

void set_lamp(int lamp, int val) {
  int pin = LAMP_0_PIN;
  if (lamp)
    pin = LAMP_1_PIN;
  digitalWrite(pin, val);
}

void toggle_lamp(int lamp) {
  int curr = get_lamp(lamp);
  set_lamp(lamp, !curr);
}

// Authorization
void authorize_req(Request &req, Response &res) {
  char *authHeader = req.get("Authorization");
  Serial.print("Auth info: ");
  Serial.println(authHeader);
  if (!authHeader || strcmp(authHeader, AUTH_STR) != 0) {
    res.set("WWW-Authenticate", "Basic");
    res.sendStatus(401);
    res.end();
  }
}

// Request callbacks
void get_lamp_req(Request &req, Response &res) {
  if (deserializeJson(req_doc, req)) {
    Serial.println("Failed to deserialize json\n");
  }
  
  int lamp = req_doc["lamp"];
  Serial.print("Got request for lamp ");
  Serial.println(lamp);

  res_doc.clear();
  res_doc["lamp"] = lamp;
  res_doc["value"] = get_lamp(lamp);

  res.set("Content-Type", "application/json");
  res.beginHeaders();
  res.endHeaders();
  res.sendStatus(200);
  serializeJson(res_doc, res);
  req_doc.clear();
}

void set_lamp_req(Request &req, Response &res) {
  if (deserializeJson(req_doc, req)) {
    Serial.println("Failed to deserialize json\n");
  }

  int lamp = req_doc["lamp"];
  Serial.print("Got request to toggle lamp ");
  Serial.println(lamp);

  if (lamp >= NUM_LAMPS || lamp < 0) {
    res.sendStatus(400);
    req_doc.clear();
    return;
  }

  toggle_lamp(lamp);

  res_doc.clear();
  res_doc["lamp"] = lamp;
  res_doc["value"] = get_lamp(lamp);

  res.set("Content-Type", "application/json");
  res.beginHeaders();
  res.endHeaders();
  res.sendStatus(200);
  serializeJson(res_doc, res);
  req_doc.clear();
}

void get_temp_req(Request &req, Response &res) {
  
  Serial.println("Got request for temperature");
  temp.requestTemperatures();

  res_doc.clear();
  res_doc["temp"] = temp.getTempFByIndex(0);

  res.set("Content-Type", "application/json");
  res.beginHeaders();
  res.endHeaders();
  res.sendStatus(200);
  serializeJson(res_doc, res);
  req_doc.clear();
}

void setup() {
  init_lamps();
  temp.begin();
  Serial.begin(115200);

  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println(WiFi.localIP());

  app.header("Authorization", authorization, 100);

  app.use(&authorize_req);
  app.get("/lamp", &get_lamp_req);
  app.put("/lamp", &set_lamp_req);
  app.put("/temp", &get_temp_req);
  app.use(staticFiles());

  server.begin();
}

void loop() {
  WiFiClient client = server.available();

  if (client.connected()) {
    app.process(&client);
  }
}