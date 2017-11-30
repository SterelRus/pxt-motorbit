
/**
 * Use this file to define custom functions and blocks.
 * Read more at https://makecode.microbit.org/blocks/custom
 */

enum MyEnum {
    //% block="one"
    One,
    //% block="two"
    Two
}



/**
 * Custom blocks
 */
//% weight=10 color=#0fbc11 icon="\uf0ee"
namespace environment {
    let dustvled = DigitalPin.P10
    let dustvo = AnalogPin.P1

    let wifiTX = SerialPin.P8
    let wifiRX = SerialPin.P2

    let dht11buf: number[] = []

    /**
     * TODO: describe your function here
     * @param vLED describe parameter here, eg: DigitalPin.P10
     * @param vo describe parameter here, eg: AnalogPin.P1
     */
    //% blockId="dust_init" block="dust sensor init at vLED %vLED| vo %vo"
    //export function initiotkit(n: number, s: string, e: MyEnum): void {
    export function initdust(vLED: DigitalPin, vo: AnalogPin): void {
        dustvled = vLED
        dustvo = vo
        // Add code here

    }


    /**
     * TODO: describe your function here
     * @param wifiRX describe parameter here, eg: SerialPin.P8
     * @param wifiTX describe parameter here, eg: SerialPin.P2
     */
    //% blockId="wifi_init" block="set wifi TX %serialTX| RX %serialRX"
    //export function initiotkit(n: number, s: string, e: MyEnum): void {
    export function initwifi(wifiRX: SerialPin, wifiTX: SerialPin): void {
        serial.redirect(
            wifiRX,
            wifiTX,
            BaudRate.BaudRate9600
        )
        // Add code here
    }


    /**
     * TODO: describe your function here
     * @param value describe value here, eg: 5
     */
    //% block  
    export function ReadDust(): number {
        let voltage = 0;
        let dust = 0;
        pins.digitalWritePin(dustvled, 0);
        control.waitMicros(280);
        voltage = pins.analogReadPin(dustvo);
        control.waitMicros(40);
        pins.digitalWritePin(dustvled, 1);
        voltage = pins.map(
            voltage,
            0,
            1023,
            0,
            4650
        );
        dust = (voltage - 580) * 5 / 29;
        return dust;
    }

    //% blockId="readtemp" block="read temperature at pin %temp"
    export function ReadTemperature(temppin: AnalogPin): number {
        let voltage = 0;
        let Temperature = 0;

        voltage = pins.map(
            pins.analogReadPin(temppin),
            0,
            1023,
            0,
            3100
        );

        Temperature = (voltage - 500) / 10;
        return Temperature;
    }

    /**
     * TODO: describe your function here
     * @param dht11pin describe parameter here, eg: DigitalPin.P0
     */
    //% blockId="readhumidity" block="read humidity at pin %dht11pin"
    export function ReadHumidity(dht11pin: DigitalPin): number {
        let humidity  = 0
        let runtime = 0

        pins.digitalWritePin(dht11pin, 0)
        basic.pause(18)
        pins.digitalWritePin(dht11pin, 1)
        control.waitMicros(40)
        pins.digitalWritePin(dht11pin, 0)

        //等待高电平响应
        while (pins.digitalReadPin(dht11pin) != 1) {
        }
        //等待低电平响应
        while (pins.digitalReadPin(dht11pin) != 0) {
        }

        for (let i = 0; i < 40; i++) {
            while (pins.digitalReadPin(DigitalPin.P0) == 0) {
            }
            runtime = input.runningTimeMicros()
            while (pins.digitalReadPin(DigitalPin.P0) == 1) {
            }
            runtime = input.runningTimeMicros() - runtime
            if (runtime >= 50) {
                dht11buf.push(1)
            } else {
                dht11buf.push(0)
            }
        }
        humidity = dht11buf[0] * 128 
            + dht11buf[1] * 64 
            + dht11buf[2] * 32 
            + dht11buf[3] * 16 
            + dht11buf[4] * 8 
            + dht11buf[5] * 4 
            + dht11buf[6] * 2 
            + dht11buf[7];
            
        humidity = 0
        return humidity;
    }



}
