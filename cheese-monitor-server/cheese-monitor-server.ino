#include <WiFi.h>
#include "aWOT.h"
#include "StaticFiles.h"

#define WIFI_SSID "network"
#define WIFI_PASSWORD "password"
 
#define LAMP_0_PIN  18
#define LAMP_1_PIN  19
#define TMP_PIN     21

WiFiServer server(80);
Application app;
OneWire oneWire(TMP_PIN);
DallasTemperature temp(&oneWire); // Thermometer

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
  if (lamp == 1)
    pin = LAMP_1_PIN;
  digitalWrite(pin, val);
}

void toggle_lamp(int lamp) {
  int curr = get_lamp(lamp);
  set_lamp(lamp, !curr);
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

  app.use(staticFiles());

  server.begin();
}

void loop() {
  WiFiClient client = server.available();

  if (client.connected()) {
    app.process(&client);
  }
}