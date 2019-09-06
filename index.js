const Alexa = require('ask-sdk-core');

// Text strings

const welcomeOutput = "Hello, which product would you like to know about?";
const welcomeReprompt = "Let me know which product or product spec you would like to know about";
const helpOutput = 'Try asking about a specific product or product line.';
const helpReprompt = 'Try asking about a specific product or product line.';

// Intent Handlers

const LaunchRequestHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'LaunchRequest';
  },
  handle(handlerInput) {
    const responseBuilder = handlerInput.responseBuilder;
    return responseBuilder
      .speak(welcomeOutput)
      .reprompt(welcomeReprompt)
      .getResponse();
  },
};

const InProgressHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest' &&
      request.intent.name === 'HellloWorldIntent' &&
      request.dialogState !== 'COMPLETED';
  },
  handle(handlerInput) {
    const currentIntent = handlerInput.requestEnvelope.request.intent;
    return handlerInput.responseBuilder
      .addDelegateDirective(currentIntent)
      .getResponse();
  },
};

const CompletedHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest' && request.intent.name === 'HellloWorldIntent';
  },
  handle(handlerInput) {
    const responseBuilder = handlerInput.responseBuilder;
    const filledSlots = handlerInput.requestEnvelope.request.intent.slots;
    const slotValues = getSlotValues(filledSlots);
    let speechOutput = `${speechOutput} from ${slotValues.product.synonym}`;
    
    return responseBuilder
      .speak(speechOutput)
      .getResponse();
  },
};

const MaxCapacityHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'LaunchRequest' 
      || (request.type === 'IntentRequest'
        && request.intent.name === 'MaxCapacityIntent');
  },
  handle(handlerInput) {
    const responseBuilder = handlerInput.responseBuilder;
    const filledSlots = handlerInput.requestEnvelope.request.intent.slots;
    const slotValues = getSlotValues(filledSlots);
    var speechOutput;
    
    switch(slotValues.product.synonym) {
        case 'unity':
            speechOutput = 'The unity has a maximum storage capacity of 2.4, 4, 8, or 16 petabytes.';
            break;
        case 'PowerMax':
            speechOutput = 'The powermax 1000 has up to one petabyte effective capacity, and the powermax 8000 has up to four petabyte effective capacity.';
            break;
        case 'ECS':
            speechOutput = 'The ECS EX300 has up to 1536 terabyes per rack, and the EX3000S / EX3000D has up to 8640 terabytes per rack';
            break;
        default:
            speechOutput = `${speechOutput} from ${slotValues.product.synonym}`;
    }

    return responseBuilder
      .speak(speechOutput)
      .getResponse();
  },
};

const CacheSizeHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'LaunchRequest' 
      || (request.type === 'IntentRequest'
        && request.intent.name === 'CacheSizeIntent');
  },
  handle(handlerInput) {
    const responseBuilder = handlerInput.responseBuilder;
    const filledSlots = handlerInput.requestEnvelope.request.intent.slots;
    const slotValues = getSlotValues(filledSlots);
    var speechOutput;
    
    switch (slotValues.product.synonym) {
        case 'unity':
            speechOutput = 'unity cache';
            break;
        case 'PowerMax':
            speechOutput = 'The powermax 2000 has a minimum cache of 512 gigabytes, and a maximum cache of 4 terabytes. The powermax 8000 has a minimum cache of 1 terabyte, and a maximum cache of 16 terabytes.';
            break;
        default:
            speechOutput = `${speechOutput} from ${slotValues.product.synonym}`;
    }

    return responseBuilder
      .speak(speechOutput)
      .getResponse();
  },
};

const CPUHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'LaunchRequest' 
      || (request.type === 'IntentRequest'
        && request.intent.name === 'CPUIntent');
  },
  handle(handlerInput) {
    const responseBuilder = handlerInput.responseBuilder;
    const filledSlots = handlerInput.requestEnvelope.request.intent.slots;
    const slotValues = getSlotValues(filledSlots);
    var speechOutput;
    
    switch (slotValues.product.synonym) {
        case 'unity':
            speechOutput = 'unity CPU';
            break;
        case 'PowerMax':
            speechOutput = 'The Powermax contains either an Intel Zeon E5-2650 with 12 cores, or a Zeon E5-2697 with 18 cores.';
            break;
        default:
            speechOutput = `${speechOutput} from ${slotValues.product.synonym}`;
    }

    return responseBuilder
      .speak(speechOutput)
      .getResponse();
  },
};

const SummaryHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'LaunchRequest' 
      || (request.type === 'IntentRequest'
        && request.intent.name === 'SummaryIntent');
  },
  handle(handlerInput) {
    const responseBuilder = handlerInput.responseBuilder;
    const filledSlots = handlerInput.requestEnvelope.request.intent.slots;
    const slotValues = getSlotValues(filledSlots);
    var speechOutput;
    
    switch(slotValues.product.synonym) {
        case 'poweredge XR2':
            speechOutput = 'The poweredge X R 2 is a compact 1U 2-socket server with up to 8 2.5 inch hot-swappable drives. Target use cases include virtualization and software defined storage including V san.';
            break;
        case 'poweredge T1 40':
            speechOutput = 'The poweredge T1 40 is an easy to use and safe entry-level single-socket tower server designed for general-purpose business applications and remote offices. Target use cases include mail and messaging, as well as point of sale operations.';
            break;
        case 'poweredge T4 40':
            speechOutput = 'The poweredge T4 40 is a powerful yet quiet workhorse build for office workloads. Target use cases include mail, collaboration, and virtualization, as well as mid-size business analytics and intelligence.';
            break;
        case 'poweredge T6 40':
            speechOutput = 'The poweredge T6 40 is a versatile and scalable powerhouse server with massive internal storage capacity in either rack or tower form. Target use cases include desktop and server virtualization, ERP, and consolidation, as well as databases, business intelligence, and analytics';
            break;
        case 'poweredge R2 40':
            speechOutput = 'The poweredge R2 40 is a single-socket entry-level rack server designed for businesses looking for enterprise class features at an affordable price. Target use cases include web server hosting, mail, messaging, and collaboration.';
            break;
        case 'poweredge R3 40':
            speechOutput = 'The poweredge R3 40 is a single-socket rack server designed for productivity and data intensive applications for remote or branch offices. Target use cases include collaboration, mail, messaging, and backup and recovery.';
            break;
        case 'poweredge R4 40':
            speechOutput = 'The poweredge R4 40 is a single-socket rack server optimized for dense scale-out computing and storage. Target use cases include high performance computing, virtualization, web-tech deployments, and applications.';    
            break;
        case 'poweredge R5 40':
            speechOutput = 'The poweredge R5 40 is a versatile 2U server providing balanced compute and storage to adapt to a variety of applications. Target use cases include softwarae defined storage, messaging, and video streaming.';
            break;
        case 'poweredge R6 40':
            speechOutput = 'The poweredge R6 40 is an ideal combination for dense scale out data center computing and storage in a 1U platform. Target use cases include HPC, virtualization, and software defined storage.';
            break;
        case 'poweredge R7 40':
            speechOutput = 'The poweredge R7 40 is a workhorse server providing storage, I/O, and application accelaration balance with configuration flexibility. Target use cases include VDI, AI, machine learning, and private cloud utilities.';
            break;
        case 'poweredge R7 40 XD':
            speechOutput = speechOutput = 'The poweredge R7 40 XD is an ideal server for applications requiring best-in-class storage performance, high scalability, and density. Target use cases include software defined storage, big data, unstructured data, and analytics.';
            break;
        case 'poweredge R7 40 XD2':
        case 'poweredge R7 40 xd2':
            speechOutput = 'The poweredge R7 40 XD 2 is a high performance enterprise content server. Target use cases include media streaming, exchange / sharepoint, software-defined-storage, and Hadoop';
            break;
        case 'poweredge R8 40':
            speechOutput = 'The poweredge R8 40 is a high-performance 2U server built for demanding applications. Target use cases include data intensive applications and data analytics.';
            break;
        case 'poweredge R9 40':
            speechOutput = 'The poweredge R9 40 is a 3U server designed to handle extremely demanding, mission-critical workloads and large databases. Target use cases include in-memory databases, analytics, and dense virtualization, including data-redundant hypervisors and fault-resistent memory.';
            break;
        case 'poweredge R9 40 xa':
        case 'poweredge R9 40 XA':
            speechOutput = 'The poweredge R9 40 X A is an extremely powerful 4U server designed to run complex workloads using highly scalable memory. Target use cases include compute-intensive applications, machine learning, artificial intelligence, and GPU database acceleration.';
            break;
        case 'unity':
            speechOutput = 'The Dell EMC Unity sets new standards for midrange storage with a powerful combination of simplicity, modern design, affordable price point, and deployment flexibility. The unity is available in either all-flash or hybrid models. Target use cases include databases, transactional workloads, and general-purpose workloads.';
            break;
        case 'unity XT':
            speechOutput = 'The unity XT delivers impressive gains in performance and efficiency and provides multiple paths to the cloud. The unity XT is available in either all-flash or hybrid models. Target use cases include databases, transactional workloads, and general purpose workloads.';
            break;
        case 'sc series':
        case 'SC series':
            speechOutput = 'The SC Series is a general purpose block storage system available in either all-flash or hybrid models. Target use cases include databases, mixed mainstream workloads, and data warehouse applications.';
            break;
        case 'PowerMax':
            speechOutput = 'The powermax is a modern storage array designed to be powerful, simple, and trusted with absolutely no compromises. Target use cases include traditional and next generation applications, financial sesrvices, healthcare, life sciences, and other workloads where the highest performance and availability is required.';
            break;
        case 'extreme IO':
            speechOutput = 'The extreme IO is a purpose-built, all-flash array offering high performance with consistently low latency. Target use cases include virtualized environments, including VDI environments, and workloads which benefit from efficient copy data management and data reduction ratios.';
            break;
        case 'isilon':
            speechOutput = 'The isilon is the industries number one scale-out network-attached-storage solution, available with either all-flash, hybrid, or archiving nodes. Target use cases include high performance computing, enterprise workloads, data analytics, and deep archiving.';
            break;
        case 'ECS':
            speechOutput = 'The ECS is an industry-leading object storage platform built to support traditional and next-generation workloads, with near-infinite scalability. Target use cases include telecommunications, media, and entertainment, as well as healthcare and life sciences.';
            break;
        case 'powervault':
            speechOutput = 'The powervault is a next-gen entry-level block storage array thats purpose-built and optimized for san and DAS environments. The powervault is available in either all-flash or hybrid models, and either 2U or 5U form factors. Target use cases include HPC, video surveillance, and media, as well as healthcare and life sciences.';
            break;
        case 'V Plex':
        case 'v Plex':
            speechOutput = 'The V Plex delivers continuous data availability and data mobility to ensure uptime for business critical applications and create an agile infrastructure that is easy to manage and reconfigure. Target use cases include mission critical application availability, workload mobility, and non-disruptive storage array migration.';    
            break;
        case 'VX block':
        case 'vx block':
            speechOutput = 'The VX block is a turnkey converged infrastructure system for high value workload consolidation, built on powerful Dell EMC storage and data protection. Target use cases include mission critical, general purpose, and AI/ML workloads.';    
            break;
        case 'VX rail':
        case 'vx rail':
            speechOutput = 'The VX rail is the industries only HCI appliance developed and fully optimized for VM ware environments. Target use cases include industrial automation, healthcare and life sciences, military and defense, and telecommunications.';
            break;
        case 'VX rack':
        case 'vx rack':
            speechOutput = 'The VX rack is a rack-scale HCI delivering flexibility, scalability, and performance with multi-hypervisor support. Target use cases include databases, data warehousing, and transactional workloads, as well as healthcare and life sciences.';    
            break;
        case 'VX rack SDDC':
        case 'VX rack sddc':
        case 'vx rack SDDC':
        case 'vx rack sddc':
            speechOutput = 'The VX rack SDDC is a rack-scale HCI system powered by VM ware cloud foundation. VX rack SDDC is the easiest and fastest way to deploy, support, and extend a production-ready VM ware cloud.';    
            break;
        case 'VX rack AS':
        case 'VX rack as':
        case 'vx rack AS':
        case 'vx rack as':
            speechOutput = 'The VX rack A S is an on-premise hybrid cloud platform for delivering infrastructure and platform-as-a-service with a consistent Azure experience on-premises or in the public cloud. Target use cases include edge and disconnected solutions, aggregation of analytics and big data modelling, and cloud applications.';
            break;
        case 'data domain':
            speechOutput = 'The data domain is a protection storage appliance that provides fast backups and recovery, protects data on-premises and in the cloud, and delivers a lower cost-to-protect with leading data deduplication and bandwidth utilization. Target use cases include enterprise backup and archive for databases, e-mail servers, virtual machines, file shares, enterprise applications, content management, and ROBO environments.';    
            break;
        case 'IDPA':
            speechOutput = 'The IDPA is a purpose-built integrated data protection appliance that simplifies deployment and management while deliverying powerful data protection capabilities. Target use cases include backup and restore, disaster recovery, analytics, and deduplication.';    
            break;
        case 'power protect':
            speechOutput = 'The power protect is a next-generation multi-dimensional data management appliance powered by data domain deduplication. Target use cases include oracle, MS SQL, windows, and linux filesystem workloads.';    
            break;
        default:
            speechOutput = `${speechOutput} from ${slotValues.product.synonym}`;
    }

    return responseBuilder
      .speak(speechOutput)
      .getResponse();
  },
};

const HelpHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest' && request.intent.name === 'AMAZON.HelpIntent';
  },
  handle(handlerInput) {
    const responseBuilder = handlerInput.responseBuilder;
    return responseBuilder
      .speak(helpOutput)
      .reprompt(helpReprompt)
      .getResponse();
  },
};

const CancelStopHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest' &&
      (request.intent.name === 'AMAZON.CancelIntent' || request.intent.name === 'AMAZON.StopIntent');
  },
  handle(handlerInput) {
    const responseBuilder = handlerInput.responseBuilder;
    const speechOutput = 'Okay, talk to you later! ';

    return responseBuilder
      .speak(speechOutput)
      .withShouldEndSession(true)
      .getResponse();
  },
};

const SessionEndedHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'SessionEndedRequest';
  },
  handle(handlerInput) {
    console.log(`Session ended with reason: ${handlerInput.requestEnvelope.request.reason}`);
    return handlerInput.responseBuilder.getResponse();
  },
};

const ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    const request = handlerInput.requestEnvelope.request;

    console.log(`Original Request was: ${JSON.stringify(request, null, 2)}`);
    console.log(`Error handled: ${error}`);

    return handlerInput.responseBuilder
      .speak('Sorry, I can not understand the command.  Please say again.')
      .reprompt('Sorry, I can not understand the command.  Please say again.')
      .getResponse();
  },
};

// Helper Functions

function getSlotValues(filledSlots) {
  const slotValues = {};

  console.log(`The filled slots: ${JSON.stringify(filledSlots)}`);
  Object.keys(filledSlots).forEach((item) => {
    const name = filledSlots[item].name;

    if (filledSlots[item] &&
      filledSlots[item].resolutions &&
      filledSlots[item].resolutions.resolutionsPerAuthority[0] &&
      filledSlots[item].resolutions.resolutionsPerAuthority[0].status &&
      filledSlots[item].resolutions.resolutionsPerAuthority[0].status.code) {
      switch (filledSlots[item].resolutions.resolutionsPerAuthority[0].status.code) {
        case 'ER_SUCCESS_MATCH':
          slotValues[name] = {
            synonym: filledSlots[item].value,
            resolved: filledSlots[item].resolutions.resolutionsPerAuthority[0].values[0].value.name,
            isValidated: true,
          };
          break;
        case 'ER_SUCCESS_NO_MATCH':
          slotValues[name] = {
            synonym: filledSlots[item].value,
            resolved: filledSlots[item].value,
            isValidated: false,
          };
          break;
        default:
          break;
      }
    } else {
      slotValues[name] = {
        synonym: filledSlots[item].value,
        resolved: filledSlots[item].value,
        isValidated: false,
      };
    }
  }, this);

  return slotValues;
}

// Exports handlers
const skillBuilder = Alexa.SkillBuilders.custom();
exports.handler = skillBuilder
  .addRequestHandlers(
    LaunchRequestHandler,
    InProgressHandler,
    CompletedHandler,
    MaxCapacityHandler,
    CacheSizeHandler,
    CPUHandler,
    SummaryHandler,
    CancelStopHandler,
    HelpHandler,
    SessionEndedHandler,
  )
  .addErrorHandlers(ErrorHandler)
  .lambda();