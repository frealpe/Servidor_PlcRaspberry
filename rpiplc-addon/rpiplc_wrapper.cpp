#define RPIPLC_V6
#define RPIPLC_58

#include <napi.h>
#include <librpiplc/expanded-gpio.h>
#include <librpiplc/rpiplc.h>
#include "common.h"

// ---------------- Digital ----------------
Napi::Number WriteDigital(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();
    if (info.Length() < 2) return Napi::Number::New(env, -1);
    uint32_t pin = info[0].As<Napi::Number>().Uint32Value();
    uint8_t value = info[1].As<Napi::Number>().Uint32Value();
    pinMode(pin, OUTPUT);
    int res = digitalWrite(pin, value);
    return Napi::Number::New(env, res);
}

Napi::Number ReadDigital(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();
    if (info.Length() < 1) return Napi::Number::New(env, -1);
    uint32_t pin = info[0].As<Napi::Number>().Uint32Value();
    int res = digitalRead(pin);
    return Napi::Number::New(env, res);
}

// ---------------- ADC / PWM ----------------
Napi::Number ReadADC(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();
    if (numAnalogInputs == 0) return Napi::Number::New(env, -1);
    uint16_t value = analogRead(analogInputs[0]);
    return Napi::Number::New(env, value);
}

Napi::Number WritePWM(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();
    if (numAnalogOutputs == 0 || info.Length() < 1) return Napi::Number::New(env, -1);
    uint8_t duty = info[0].As<Napi::Number>().Uint32Value();
    analogWrite(analogOutputs[0], duty);
    return Napi::Number::New(env, 0);
}

// ---------------- Init ----------------
Napi::Object Init(Napi::Env env, Napi::Object exports) {
    initExpandedGPIO(false);
    exports.Set("writeDigital", Napi::Function::New(env, WriteDigital));
    exports.Set("readDigital", Napi::Function::New(env, ReadDigital));
    exports.Set("readADC", Napi::Function::New(env, ReadADC));
    exports.Set("writePWM", Napi::Function::New(env, WritePWM));
    return exports;
}

NODE_API_MODULE(rpiplc, Init)
