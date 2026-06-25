#include <WiFi.h>
#include <HTTPClient.h>
#include <Wire.h>
#include <RTClib.h>
#include <LiquidCrystal_I2C.h>

RTC_DS3231 rtc;
LiquidCrystal_I2C lcd(0x27,16,2);

const char* ssid = "YOUR_WIFI";
const char* password = "YOUR_PASSWORD";

String serverUrl =
"http://YOUR_PC_IP:3000";

#define REED1 14
#define REED2 27
#define REED3 26
#define LED1 18
#define LED2 19
#define LED3 23

#define BUZZER 13
#define EMERGENCY 25

int stock1 = 30;
int stock2 = 30;
int stock3 = 30;

bool morningTaken = false;
bool afternoonTaken = false;
bool nightTaken = false;

void sendStatus(String msg)
{
  if(WiFi.status()==WL_CONNECTED)
  {
    HTTPClient http;

    http.begin(serverUrl + "/medicine");

    http.addHeader(
    "Content-Type",
    "application/json");

    String body =
    "{\"status\":\""+msg+"\"}";

    http.POST(body);

    http.end();
  }
}

void setup()
{
  Serial.begin(115200);

  pinMode(REED1,INPUT_PULLUP);
  pinMode(REED2,INPUT_PULLUP);
  pinMode(REED3,INPUT_PULLUP);

  pinMode(LED1,OUTPUT);
  pinMode(LED2,OUTPUT);
  pinMode(LED3,OUTPUT);

  pinMode(BUZZER,OUTPUT);

  pinMode(EMERGENCY,INPUT_PULLUP);

  Wire.begin();

  rtc.begin();

  lcd.init();
  lcd.backlight();

  lcd.setCursor(0,0);
  lcd.print("CarePill");

  WiFi.begin(ssid,password);

  while(WiFi.status()!=WL_CONNECTED)
  {
    delay(500);
  }

  lcd.clear();
  lcd.print("WiFi Connected");
  delay(2000);
}

void loop()
{
  DateTime now = rtc.now();

  int hr = now.hour();
  int mn = now.minute();

  // MORNING MEDICINE
  if(hr==8 && mn==0 && !morningTaken)
  {
    digitalWrite(LED1,HIGH);

    tone(BUZZER,1000);

    lcd.clear();
    lcd.print("Morning Dose");
    lcd.setCursor(0,1);
    lcd.print("Open Box 1");

    sendStatus("Morning Reminder");
  }

  // AFTERNOON MEDICINE
  if(hr==14 && mn==0 && !afternoonTaken)
  {
    digitalWrite(LED2,HIGH);

    tone(BUZZER,1000);

    lcd.clear();
    lcd.print("Afternoon Dose");

    sendStatus("Afternoon Reminder");
  }

  // NIGHT MEDICINE
  if(hr==20 && mn==0 && !nightTaken)
  {
    digitalWrite(LED3,HIGH);

    tone(BUZZER,1000);

    lcd.clear();
    lcd.print("Night Dose");

    sendStatus("Night Reminder");
  }

  // CHAMBER 1 OPENED
  if(digitalRead(REED1)==LOW)
  {
    morningTaken = true;

    noTone(BUZZER);

    digitalWrite(LED1,LOW);

    stock1--;

    lcd.clear();
    lcd.print("Morning Taken");

    sendStatus("Morning Taken");

    delay(1000);
  }

  // CHAMBER 2 OPENED
  if(digitalRead(REED2)==LOW)
  {
    afternoonTaken = true;

    noTone(BUZZER);

    digitalWrite(LED2,LOW);

    stock2--;

    lcd.clear();
    lcd.print("Afternoon Taken");

    sendStatus("Afternoon Taken");

    delay(1000);
  }

  // CHAMBER 3 OPENED
  if(digitalRead(REED3)==LOW)
  {
    nightTaken = true;

    noTone(BUZZER);

    digitalWrite(LED3,LOW);

    stock3--;

    lcd.clear();
    lcd.print("Night Taken");

    sendStatus("Night Taken");

    delay(1000);
  }

  // LOW STOCK ALERT
  if(stock1 <= 5)
  {
    sendStatus("Morning Medicine Low");
  }

  if(stock2 <= 5)
  {
    sendStatus("Afternoon Medicine Low");
  }

  if(stock3 <= 5)
  {
    sendStatus("Night Medicine Low");
  }

  // EMERGENCY BUTTON
  if(digitalRead(EMERGENCY)==LOW)
  {
    lcd.clear();

    lcd.print("EMERGENCY!");

    sendStatus("Emergency Alert");

    delay(3000);
  }

  delay(200);
}