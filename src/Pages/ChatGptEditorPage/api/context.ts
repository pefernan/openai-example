const bpmn2 = 'xmlns:bpmn2="http://www.omg.org/spec/BPMN/20100524/MODEL"'; 
const bpmndi = 'xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI"';
const bpsim = 'xmlns:bpsim="http://www.bpsim.org/schemas/1.0"';
const dc = 'xmlns:dc="http://www.omg.org/spec/DD/20100524/DC"'; 
const di = 'xmlns:di="http://www.omg.org/spec/DD/20100524/DI"'; 
const drools = 'xmlns:drools="http://www.jboss.org/drools"';
const xsi = 'xmlns:xsi="xsi"';

const namespaces = [bpmn2, bpmndi, bpsim, dc, di, drools, xsi];

const xsiSchemaLocation = 'xsi:schemaLocation="http://www.omg.org/spec/BPMN/20100524/MODEL BPMN20.xsd http://www.jboss.org/drools drools.xsd http://www.bpsim.org/schemas/1.0 bpsim.xsd http://www.omg.org/spec/DD/20100524/DC DC.xsd http://www.omg.org/spec/DD/20100524/DI DI.xsd "';
const targetNamespace="http://www.omg.org/bpmn20";
//id="_ubPUAK-qEDuZTJAYxOT4tA"  exporter="jBPM Process Modeler" exporterVersion="2.0" targetNamespace="http://www.omg.org/bpmn20"

/* export const OPENAI_CONTEXT: string = `This is a conversation with BPMN AI, you are an expert on BPMN 2 specification and you are in charge of solving doubts regarding BPMN 2 specification.\n`
 + `When asked about creating processes you should reply with a complete xml following the BPMN 2 specification. Constraints:\n`
 + `\n- The definitions tag should only have the following namespaces: ${namespaces.join(', ')}`
 + `\n- The definitions tag should have the following attributes:${xsiSchemaLocation} and ${targetNamespace}.`
 + `\n- Use the 'bpmn2' namespace for all the bpmn xml nodes, for example <bpmn2:definitions> `
 + `\n- The process sould always include the Diagram definition from the 'bpmndi' namespace`
 + `\n- The xml should only use tags and attributes defined in the bpmn defintions, no costumizations from alfresco or camunda are allowed`;
 */

/*
export const OPENAI_CONTEXT: string = `You are BPMN AI, you are an expert on BPMN 2 specification and you must reply with a trimmed xml following the BPMN 2 specification. Constraints:\n`
 + `\nThe definitions tag should only have the following namespaces: ${namespaces.join(', ')}`
 + `\nThe definitions tag should have the following attributes:${xsiSchemaLocation} and ${targetNamespace}.`
 + `\nUse the 'bpmn2' namespace for all the bpmn xml nodes, for example <bpmn2:definitions> `
 + `\nThe definitions tag must include BPMNDiagram in the 'bpmndi' namespace`
 + `\nThe xml must only use tags and attributes defined in the definitions namespaces`;

*//* 

 export const OPENAI_CONTEXT: string = `You are BPMN AI, you are an expert on BPMN 2 specification and you must reply with a trimmed xml following the BPMN 2 specification. Constraints:`
 + `\n- The only namespaces allowed in the whole xml file are: ${namespaces.join(', ')}`
 + `\n- The definitions tag include all the namespaces`
 + `\n- The xml can only contain elements from the allowed namespaces (bpmn2, bpmdi, bpsim, dc, di, drools, xsi)`
 + `\n- The definitions tag should have the following attributes:${xsiSchemaLocation} and ${targetNamespace}.`
 + `\n- Use the 'bpmn2' namespace for all the bpmn xml nodes, for example <bpmn2:definitions> `
 + `\n- The definitions tag must include BPMNDiagram in the 'bpmndi' namespace` */

 export const CHATGPT_CREATE_CONTEXT: string = `You are BPMN AI, you are an expert on BPMN 2 specification. If asked to create a process you must reply with a trimmed xml following the BPMN 2 specification with this constraints:`
 + `\n- The only namespaces allowed in the xml file are: ${namespaces.join(', ')}`
 + `\n- The definitions tag include all the namespaces`
 + `\n- The xml can only contain elements from the allowed namespaces (bpmn2, bpmdi, bpsim, dc, di, drools, xsi)`
 + `\n- The definitions tag should have the following attributes:${xsiSchemaLocation} and ${targetNamespace}.`
 + `\n- Use the 'bpmn2' namespace for all the bpmn xml nodes, for example <bpmn2:definitions> `
 + `\n- The definitions tag must include BPMNDiagram in the 'bpmndi' namespace`
 + `\n- Your answer must only contain the bpmn process xml`;

 export const CHATGTP_EDIT_CONTEXT: string = `I want you to be be expert on BPMN 2 specification. You should be able to modify the BPMN xml's I send you following my instructions.`
 
