const { DataType } = require("node-opcua");
const OpcClient = require("./OpcClient");

class OpcService {
    constructor() {
        this.client = new OpcClient();
        this.endpointUrl = "opc.tcp://10.233.106.180:4334/Plc/PlcOpcServer"; // 👉 Servidor en tu PC
        this.connected = false;
    }

    async connect() {
        if (!this.connected) {
            await this.client.connect(this.endpointUrl);
            this.connected = true;
        }
    }

    // ------------------------
    // Variables específicas
    // ------------------------
    async readADC() {
        await this.connect();
        const value = await this.client.readVariable("ns=1;s=ADC");
        
        return { variable: "ADC", value };
    }

    async writeADC(value) {
        console.log("Valor a escribir en OPC:", value);
        await this.connect();
        await this.client.writeVariable("ns=1;s=ADC", value, DataType.Double);
        return { variable: "ADC", value };
    }

    async readPWM() {
        await this.connect();
        const value = await this.client.readVariable("ns=1;s=PWM");
        return { variable: "PWM", value };
    }
     async writePWM(value) {
        await this.connect();
        await this.client.writeVariable("ns=1;s=PWM", value, DataType.Double);
        return { variable: "PWM", value };
    }

    async readValveState() {
        await this.connect();
        const value = await this.client.readVariable("ns=1;s=ValveState");
        return { variable: "ValveState", value };
    }

    async writeValveState(value) {
        await this.connect();
        await this.client.writeVariable("ns=1;s=ValveState", value, DataType.Boolean);
        return { variable: "ValveState", value };
    }

    // ------------------------
    async disconnect() {
        if (this.connected) {
            await this.client.disconnect();
            this.connected = false;
        }
    }
}

module.exports = new OpcService();
