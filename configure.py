import config
from base64 import b64encode as b64

def configure_credentials():
    credentials_header_path = './cheese-monitor-server/credentials.h'
    credentials_header_lines = ['#ifndef __CREDENTIALS_H__\n','#define __CREDENTIALS_H__\n']

    auth_string = b64(f'{config.USERNAME}:{config.PASSWORD}'.encode('utf-8'))

    credentials_header_lines.append(f'#define WIFI_SSID "{config.WIFI_SSID}"\n')
    credentials_header_lines.append(f'#define WIFI_PASSWORD "{config.WIFI_PASSWORD}"\n')
    credentials_header_lines.append(f'#define AUTH_STR "Basic {auth_string.decode("utf-8")}"\n')
    credentials_header_lines.append('#endif //__CREDENTIALS_H__\n')
    with open(credentials_header_path, 'w+') as f:
        f.writelines(credentials_header_lines)

    return

if __name__ == "__main__":
    configure_credentials()