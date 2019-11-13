const Alexa = require('ask-sdk-core');

// Text strings

const welcomeOutput = "Welcome to Dell Handler. Would you like a list of available products, or do you need help with a specific product?";
const welcomeReprompt = "Let me know which product you would like to know about";
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
        /*
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
        */
        case 'sc series':
        case 'SC series':
            speechOutput = 'The SC Series is a general purpose block storage system available in either all-flash or hybrid models. Target use cases include databases, mixed mainstream workloads, and data warehouse applications.';
            break;
        /*
        case 'PowerMax':
            speechOutput = 'The powermax is a modern storage array designed to be powerful, simple, and trusted with absolutely no compromises. Target use cases include traditional and next generation applications, financial sesrvices, healthcare, life sciences, and other workloads where the highest performance and availability is required.';
            break;
        */
        case 'extreme IO':
            speechOutput = 'The extreme IO is a purpose-built, all-flash array offering high performance with consistently low latency. Target use cases include virtualized environments, including VDI environments, and workloads which benefit from efficient copy data management and data reduction ratios.';
            break;
        /*
        case 'isilon':
            speechOutput = 'The isilon is the industries number one scale-out network-attached-storage solution, available with either all-flash, hybrid, or archiving nodes. Target use cases include high performance computing, enterprise workloads, data analytics, and deep archiving.';
            break;
        */
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
        case 'powerswitch S 3,048 ON':
        case 'powerswitch S3048ON':
        case 'powerswitch S 30 48 ON':
            speechOutput = 'The powerswitch S 30 48 O N is a high-density 1 GBE open networking switch built for server and storage connectivity. Target use cases include enterprise and mid-market enviornments with existing 1 GBE installed base.';
            break;
        case 'powerswitch S 31 24':
        case 'powerswitch S3124':
        case 'powerswitch S 3,124':
            speechOutput = 'The powerswitch S 31 24 series is a high-performance 24-port managed ethernet switch designed for non-blocking access. Target use cases include enterprise and mid-market enviornments with existing 1 GBE installed base.';
            break;
        case 'powerswitch S 31 48':
        case 'powerswitch S3148':
        case 'powerswitch S 3,148':
            speechOutput = 'The powerswitch S 31 48 series is a high-performance 48-port managed ethernet switch designed for non-blocking access. Target use cases include enterprise and mid-market enviornments with existing 1 GBE installed base.';
            break;
        case 'powerswitch S 40 100 ON':
        case 'powerswitch S 4,100 ON':
            speechOutput = 'The powerswitch S 40 100 O N series is a high performance open networking top-of-rack switch with multirate Gigabit ethernet and unified ports. Target use cases include 10/100 GBE in-rack connectivity for servers and SDS environments, high performance computing clusters, and converged lan / san environments.';
            break;
        case 'powerswitch S 42 48 FB':
        case 'powerswitch S4248 FB':
        case 'powerswitch S 4,248 FB':
        case 'powerswitch S 42 48':
        case 'powerswitch S 4248':
        case 'powerswitch S 4,248':
            speechOutput = 'The powerswitch S42 48 FB is a state of the art deep-buffer 10/100 GBE data center switching platform built for top-of-rack and data center edge. Target use cases include HPC clusters, big data clusters, video distribution networks, storage networks, or other business-sensitive deployments that require the highest bandwidth.';
            break;
        default:
            speechOutput = `${speechOutput} from ${slotValues.product.synonym}`;
    }

    return responseBuilder
      .speak(speechOutput)
      .getResponse();
  },
};

const PoweredgeSummaryHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'LaunchRequest' 
      || (request.type === 'IntentRequest'
        && request.intent.name === 'PoweredgeSummaryIntent');
  },
  handle(handlerInput) {
    const responseBuilder = handlerInput.responseBuilder;
    const filledSlots = handlerInput.requestEnvelope.request.intent.slots;
    const slotValues = getSlotValues(filledSlots);
    var speechOutput;
    
    switch(slotValues.model.synonym) {
        case 'XR2':
        case 'x. r. two':
            speechOutput = 'The poweredge X R 2 is a compact 1U 2-socket server with up to 8 2.5 inch hot-swappable drives. Target use cases include virtualization and software defined storage including V san.';
            break;
        case 'T1 40':
        case 't. one forty':
        //case 't1 forty':
            speechOutput = 'The poweredge T1 40 is an easy to use and safe entry-level single-socket tower server designed for general-purpose business applications and remote offices. Target use cases include mail and messaging, as well as point of sale operations.';
            break;
        case 'T3 40':
        case 't. three forty':
            speechOutput = 'The poweredge T3 40 is a reliable, easy to manage, and scalable single-socket tower server designed for general purpose business appliactions. Target use cases include collaboration, sharing, database, backup, and recovery.';
            break;
        case 'T4 40':
        case 't. four forty':
            speechOutput = 'The poweredge T4 40 is a powerful yet quiet workhorse build for office workloads. Target use cases include mail, collaboration, and virtualization, as well as mid-size business analytics and intelligence.';
            break;
        case 'T6 40':
        case 't. six forty':
            speechOutput = 'The poweredge T6 40 is a versatile and scalable powerhouse server with massive internal storage capacity in either rack or tower form. Target use cases include desktop and server virtualization, ERP, and consolidation, as well as databases, business intelligence, and analytics';
            break;
        case 'R2 40':
            speechOutput = 'The poweredge R2 40 is a single-socket entry-level rack server designed for businesses looking for enterprise class features at an affordable price. Target use cases include web server hosting, mail, messaging, and collaboration.';
            break;
        case 'R3 40':
            speechOutput = 'The poweredge R3 40 is a single-socket rack server designed for productivity and data intensive applications for remote or branch offices. Target use cases include collaboration, mail, messaging, and backup and recovery.';
            break;
        case 'R4 40':
            speechOutput = 'The poweredge R4 40 is a single-socket rack server optimized for dense scale-out computing and storage. Target use cases include high performance computing, virtualization, web-tech deployments, and applications.';    
            break;
        case 'R5 40':
            speechOutput = 'The poweredge R5 40 is a versatile 2U server providing balanced compute and storage to adapt to a variety of applications. Target use cases include softwarae defined storage, messaging, and video streaming.';
            break;
        case 'R6 40':
            speechOutput = 'The poweredge R6 40 is an ideal combination for dense scale out data center computing and storage in a 1U platform. Target use cases include HPC, virtualization, and software defined storage.';
            break;
        case 'R7 40':
            speechOutput = 'The poweredge R7 40 is a workhorse server providing storage, I/O, and application accelaration balance with configuration flexibility. Target use cases include VDI, AI, machine learning, and private cloud utilities.';
            break;
        case 'R7 40 XD':
            speechOutput = 'The poweredge R7 40 XD is an ideal server for applications requiring best-in-class storage performance, high scalability, and density. Target use cases include software defined storage, big data, unstructured data, and analytics.';
            break;
        case 'R7 40 XD2':
        case 'R7 40 xd2':
            speechOutput = 'The poweredge R7 40 XD 2 is a high performance enterprise content server. Target use cases include media streaming, exchange / sharepoint, software-defined-storage, and Hadoop';
            break;
        case 'R8 40':
            speechOutput = 'The poweredge R8 40 is a high-performance 2U server built for demanding applications. Target use cases include data intensive applications and data analytics.';
            break;
        case 'R9 40':
            speechOutput = 'The poweredge R9 40 is a 3U server designed to handle extremely demanding, mission-critical workloads and large databases. Target use cases include in-memory databases, analytics, and dense virtualization, including data-redundant hypervisors and fault-resistent memory.';
            break;
        case 'R9 40 xa':
        case 'R9 40 XA':
            speechOutput = 'The poweredge R9 40 X A is an extremely powerful 4U server designed to run complex workloads using highly scalable memory. Target use cases include compute-intensive applications, machine learning, artificial intelligence, and GPU database acceleration.';
            break;
        case 'R 6,415':
            speechOutput = 'The poweredge R64 15 is a dense, highly configurable single socket server that offers superior TCO for scale-out software defined storage for the edge and for dense virtualization evironments. Target use cases include distributed core and edge computing, scale out SDS, and dense virtualization.';
            break;
        case 'R 7,415':
            speechOutput = 'The poweredge R74 15 is a highly scalable single socket 2U server delivering outstanding TCO for scale-up and scale-out SDS supporting high performance edge computing. Target use cases include distributed core and edge computing, low latency high capacity SDS, virtualization, and BI analysis.';
            break;
        case 'R 7,425':
            speechOutput = 'The poweredge R74 25 is a highly scalable 2U two socket server that delivers outstanding TCO and allows users to easily add extreme memory and stroage capacity for low latency, data intensive workloads. Target use cases include HPC and CFD, VDI cloud client computing, database analytics, and scale-up SDS environments.';
            break;
        case 'MX 7,000':
            speechOutput = 'The poweredge MX 7,000 chassis hosts disaggregated blocks of server and storage nodes to create consumable resources on-demand. Target use cases include extreme density solutions and hyper converged infrastructure.';
            break;
        case 'MX 740 C':
        case 'MX7 40 C':
            speechOutput = 'The poweredge MX 7 40 C is a high performance compute node built for the MX 7,000 chassis. The MX 7 40 C acts as the foundation for software defined storage and networking, hyperconverged infrastructure, and dense virtualization.';
            break;
        case 'MX 840 C':
        case 'MX8 40 C':
            speechOutput = 'The poweredge MX 8 40 C is a powerful scale-up compute node for exceptionally demanding use cases built for the MX 7,000 chassis. Target use cases include database-driven mission critical applications, big data analytics, and high performance workloads.';
            break;
        case 'MX 5,016 S':
            speechOutput = 'The poweredge MX 50 16 S is a dense, highly flexbible scale-out storage node built for the MX 7,000 chassis. Target use cases include software defined storage, SQL and ERP databases, and flexible virtualization.';
            break;
        case 'C 4,140':
            speechOutput = 'The poweredge C 41 40 is a 1U accelerator-optimized, high density server supporting up to 4 GPUs with superior thermal efficiency. Target use cases include machine learning, technical computing, and low latency, high performance applications.';
            break;
        case 'C 6,420':
            speechOutput = 'The poweredge C 64 20 is a 2U rack server that maximimizes density, scalability, and energy efficiency for high-performance hyperscale workloads. Target use cases include HPC, HCI, SAAS, and financial modeling.';
            break;
        case 'FX2':
            speechOutput = 'The poweredge FX2 is a hybrid computing platform with the density and efficiency of a blade server with the simplicity and cost of a rack server. The FX2 allows users to host flexible blocks of server and storage resources while providing outstanding efficiencies through shared power, cooling, networking, I/O, and management within the chassis itself.';
            break;
        
        default:
            speechOutput = `I'm sorry I didn't catch that. Please make sure the ${slotValues.model.synonym} is a valid poweredge product`;
    }

    return responseBuilder
      .speak(speechOutput)
      .getResponse();
  },
};

const StartedInProgressHelpMeIntentHandler = {
    canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === "IntentRequest"
      && handlerInput.requestEnvelope.request.intent.name === "HelpMeIntent"
      && handlerInput.requestEnvelope.request.dialogState !== 'COMPLETED';
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder
      .addDelegateDirective()
      .getResponse();
  }
}

const ListGivenHelpMeIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === "IntentRequest"
      && handlerInput.requestEnvelope.request.intent.name === "HelpMeIntent"
      && handlerInput.requestEnvelope.request.intent.slots.list_or_product.value 
      && handlerInput.requestEnvelope.request.intent.slots.list_or_product.value === 'list'
      && !handlerInput.requestEnvelope.request.intent.slots.product_type.value
      && !handlerInput.requestEnvelope.request.intent.slots.specific_product.value //this is new
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder
      .speak('Would you like a list of server, data strorage, converged infrastructure, or data protection products?')
      .reprompt('Would you like a list of server, data strorage, converged infrastructure, or data protection products?')
      .addElicitSlotDirective('product_type')
      .getResponse();
  }
}

//Test
const ListGivenWithProductHelpMeIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === "IntentRequest"
      && handlerInput.requestEnvelope.request.intent.name === "HelpMeIntent"
      && handlerInput.requestEnvelope.request.intent.slots.list_or_product.value 
      && handlerInput.requestEnvelope.request.intent.slots.list_or_product.value === 'list'
      && handlerInput.requestEnvelope.request.intent.slots.product_type.value
      && !handlerInput.requestEnvelope.request.intent.slots.specific_product.value

  },
  handle(handlerInput) {
    const product = handlerInput.requestEnvelope.request.intent.slots.product_type.value;
    if (product === 'server') {
        return handlerInput.responseBuilder
            .speak('The poweredge is Dells premier server line. Would you like a full list of poweredge models?')
            .reprompt('The poweredge is Dells premier server line. Would you like a full list of poweredge models?')
            .addElicitSlotDirective('specific_product')
            .getResponse();
    } else if (product === 'data storage') {
        return handlerInput.responseBuilder
            .speak('The products in the data storage line include the connectrix, ECS, Powermax, Unity, Unity XT, Isilon, Powervault, S C series, V max, VNX, V plex, VX Rail, and extreme IO. Can I help you with a specific product?')
            //.reprompt('List of storage, ask for specific product')
            .addElicitSlotDirective('specific_product')
            .getResponse();
    } else if (product === 'data protection') {
        return handlerInput.responseBuilder
            .speak('List of security, ask for specific product')
            .reprompt('List of security, ask for specific product')
            .addElicitSlotDirective('specific_product')
            .getResponse();
    } else if (product === 'converged infrastructure') {
        return handlerInput.responseBuilder
            .speak('The products in the converged infrastructure line include the VX block, VX Flex, VX Rack, VX Rail, and XC Series. Can I help you with a specific product?')
            //.reprompt('List of CI, ask for specific product')
            //.addElicitSlotDirective('specific_product')
            .getResponse();
    }
  }
}

const ProductGivenHelpMeIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === "IntentRequest"
      && handlerInput.requestEnvelope.request.intent.name === "HelpMeIntent"
      && handlerInput.requestEnvelope.request.intent.slots.list_or_product.value 
      && (handlerInput.requestEnvelope.request.intent.slots.list_or_product.value === 'product'  || handlerInput.requestEnvelope.request.intent.slots.list_or_product.value === 'with a' || handlerInput.requestEnvelope.request.intent.slots.list_or_product.value === 'tell me about')
      && !handlerInput.requestEnvelope.request.intent.slots.specific_product.value
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder
      .speak('Which product can I help you with?')
      .reprompt('Which product can I help you with?')
      .addElicitSlotDirective('specific_product')
      .getResponse();
  }
}

//Test 10/25
const SpecificProductGivenHelpMeIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === "IntentRequest"
      && handlerInput.requestEnvelope.request.intent.name === "HelpMeIntent"
      && handlerInput.requestEnvelope.request.intent.slots.list_or_product.value 
      //&& handlerInput.requestEnvelope.request.intent.slots.product_type.value
      && handlerInput.requestEnvelope.request.intent.slots.specific_product.value
      && !handlerInput.requestEnvelope.request.intent.slots.specific_model.value

  },
  handle(handlerInput) {
    //const product_class = handlerInput.requestEnvelope.request.intent.slots.product_type.value;
    const product = handlerInput.requestEnvelope.request.intent.slots.specific_product.value;
    if (product === 'poweredge') {
        return handlerInput.responseBuilder
            .speak('The poweredge is Dells premier server line. Would you like a full list of poweredge models?')
            .reprompt('The poweredge is Dells premier server line. Would you like a full list of poweredge models?')
            .addElicitSlotDirective('specific_model')
            .getResponse();
    } else if (product === 'unity') { //works
        return handlerInput.responseBuilder
            .speak('Ok, the unity is available in the following models: 300, 3 50F, 400, 4 50F, 500, 5 50F, 600, and 6 50F. Which model would you like to know about?')
            //.reprompt('List of storage, ask for specific product')
            .addElicitSlotDirective('specific_model')
            .getResponse();
    } else if (product === 'isilon' || product === 'isalon' || product === 'i. salon' || product === 'iceland') { //works
        return handlerInput.responseBuilder
            .speak('Ok, the isilon is available in the following models: F800, F810, H500, H400, H5600, H600, A200, and A2000. Which model would you like to know about?')
            .reprompt('List of storage, ask for specific product')
            .addElicitSlotDirective('specific_model')
            .getResponse();
    } else if (product === 'PowerMax') {
        return handlerInput.responseBuilder
            .speak('Ok, the powermax is available in the following models: The 2000 and the 8000. Which model would you like to know about?')
            .reprompt('List of storage, ask for specific product')
            .addElicitSlotDirective('specific_model')
            .getResponse();
    } else if (product === 'unity XT') { //works
        return handlerInput.responseBuilder
            .speak('Ok, the unity XT is available in the following models: 3 80, 3 80F, 4 80, 4 80F, 6 80, 6 80F, 8 80, and 8 80F. Which model would you like to know about?')
            .reprompt('List of storage, ask for specific product')
            .addElicitSlotDirective('specific_model')
            .getResponse();
    } else if (product === 'SC series') { //works
        return handlerInput.responseBuilder
            .speak('Ok, the S C series is available in the following models: 50 20, 50 20F, 70 20, 70 20F, V 3000, and 9000. Which model would you like to know about?')
            .reprompt('List of storage, ask for specific product')
            .addElicitSlotDirective('specific_model')
            .getResponse();
    } else if (product === 'V max' || product === 'vmax' || product === 'v. max') { //works
        return handlerInput.responseBuilder
            .speak('Ok, the V max is available in the following models: 2 50F, 9 50F, 100K, 200K, and 400K. Which model would you like to know about?')
            .reprompt('List of storage, ask for specific product')
            .addElicitSlotDirective('specific_model')
            .getResponse();
    } else if (product === 'ECS') {
        return handlerInput.responseBuilder
            .speak('The ECS is the leading object-storage platform from Dell EMC, and has been engineered to support both traditional and next-generation workloads. The ECS supports object, file, and HDFS protocols and offers configurations from 60 terabytes to 8.6 petabytes in a single rack.')
            .getResponse();
    } else if (product === 'power vault' || product === 'powervault') {
        return handlerInput.responseBuilder
            .speak('The PowerVault ME4 Series is a next-generation entry-level block storage array purpose-built and optimized for price-sensitive SAN & DAS environments. The powervault is available in either 2U or 5U form factors and can house up to Up to 336 drives with 4PB raw capacity')
            .reprompt('powervault summary')
            .getResponse();
    } else if (product === 'connectrix') {
        return handlerInput.responseBuilder
            .speak('Ok, the Connectrix is available in the following models: B series switch, B series director, MDS series switch, and MDS series director. Which model would you like to know about?')
            .reprompt('List of storage, ask for specific product')
            .addElicitSlotDirective('specific_model')
            .getResponse();
    } else if (product === 'extreme IO') { //works
        return handlerInput.responseBuilder
            .speak('The extreme IO is an all-flash storage array built for modernizing block storage workloads and offers 4 to 20 times data reduction using inline deduplication, compression, XtremIO Virtual Copies, and thin provisioning. The extreme IO can scale up from a 5U one brick cluster up to a 20U four brick cluster.')
            .getResponse();
    } else if (product === 'test') {
        return handlerInput.responseBuilder
            .speak('testing')
            .getResponse();
    }
    
  }
}

const CompletedHelpMeIntentHandler = {
    canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === "IntentRequest"
        && handlerInput.requestEnvelope.request.intent.name === "HelpMeIntent"
        && handlerInput.requestEnvelope.request.dialogState === "COMPLETED";
    },
    handle(handlerInput) {
        const l_or_p = handlerInput.requestEnvelope.request.intent.slots.list_or_product.value;
        var product = handlerInput.requestEnvelope.request.intent.slots.specific_product.value; //new
        var model = handlerInput.requestEnvelope.request.intent.slots.specific_model.value;
        var speechOutput;

        switch (product) {
            case 'unity':
                switch (model) {
                    case '300':
                        speechOutput = 'The Unity 300 is a 2U entry level hybrid flash storage system built for a wide range of SAN and NAS use cases with a maximum raw capacity of 2.4 petabytes.';
                        break;
                    case '350 F':
                        speechOutput = 'The Unity 350 F is a 2U entry level all flash storage system built for a wide range of SAN and NAS use cases with a maximum raw capacity of 2.4 petabytes.';
                        break;
                    case '400':
                        speechOutput = 'The Unity 400 is a 2U mid-range hybrid flash storage system built for a wide range of SAN and NAS use cases with a maximum raw capacity of 4 petabytes.';
                        break;
                    case '450 F':
                        speechOutput = 'The Unity 450 F is a 2U mid-range all-flash storage system built for a wide range of SAN and NAS use cases with a maximum raw capacity of 4 petabytes.';
                        break;
                    case '500':
                        speechOutput = 'The Unity 500 is a 4U mid-range hybrid flash storage system designed for midmarket to enterprise organizations, and covers the widest range of SAN and NAS workloads, with a maximum raw capacity of 8 petabytes.';
                        break;
                    case '550 F':
                        speechOutput = 'The Unity 500 F is a 4U mid-range all-flash storage system designed for midmarket to enterprise organizations, and covers the widest range of SAN and NAS workloads with a maximum raw capacity of 8 petabytes.';
                        break;
                    case '600':
                        speechOutput = 'The Unity 600 is a 6U enterprise-grade hybrid flash storage system built for the most extreme SAN and NAS use cases, and is the highest performing hybrid flash model with a maximum raw capacity of 16 petabytes.';
                        break;
                    case '650 F':
                        speechOutput = 'The Unity 600 is a 6U enterprise-grade all-flash storage system built for the most extreme SAN and NAS use cases, and is the highest performing all-flash model with a maximum raw capacity of 16 petabytes.';
                        break;
                    default:
                        speechOutput = `I'm sorry I didn't catch that. Please make sure the ${model} is a valid model for the original unity.`;
                        break;
                }
                break;
            case 'unity XT':
            case 'unity xt':
                switch (model) {
                    case '380':
                        speechOutput = 'The Unity XT 380 is a 2U entry-level hybrid flash storage system that provides simple and affordable unified storage that is designed for high performance and low latency with a maximum raw capacity of 2.4 petabytes.';
                        break;
                    case '380 F':
                        speechOutput = 'The Unity XT 380 F is a 2U entry-level all-flash storage system that provides simple and affordable unified storage that is designed for high performance and low latency with a maximum raw capacity of 2.4 petabytes.';
                        break;
                    case '480':
                        speechOutput = 'The Unity XT 480 is a 2U mid-level hybrid flash storage system that is designed for performance and is NVMe-ready to deliver high-speed access to business data with a maximum raw capacity of 4 petabytes.';
                        break;
                    case '480 F':
                        speechOutput = 'The Unity XT 480 F is a 2U mid-level all-flash storage system that is designed for performance and is NVMe-ready to deliver high-speed access to business data with a maximum raw capacity of 4 petabytes.';
                        break;
                    case '680 ':
                        speechOutput = 'The Unity XT 680 is a 2U mid-level hybrid flash storage system that is designed for performance and is NVMe-ready to deliver high-speed access to business data with a maximum raw capacity of 8 petabytes.';
                        break;
                    case '680 F':
                        speechOutput = 'The Unity XT 680 F is a 2U mid-level all-flash storage system that is designed for performance and is NVMe-ready to deliver high-speed access to business data with a maximum raw capacity of 8 petabytes.';
                        break;
                    case '880':
                        speechOutput = 'The Unity XT 880 is a 2U enterprise-grade hybrid flash storage system that is designed for performance and is NVMe-ready to deliver high-speed access to business data with a maximum raw capacity of 16 petabytes.';
                        break;
                    case '880 F':
                        speechOutput = 'The Unity XT 880 F is a 2U enterprise-grade all-flash storage system that is designed for performance and is NVMe-ready to deliver high-speed access to business data with a maximum raw capacity of 16 petabytes.';
                        break;
                    default:
                        speechOutput = `I'm sorry I didn't catch that. Please make sure the ${model} is a valid model for the unity XT.`;
                        break;
                }
                break;
            case 'isilon':
                switch(model) {
                    case 'F8 hundred':
                        speechOutput = 'The Isilon F 800 is a 4U all-flash scale out NAS platform ideal for high performance computing and unstructured data workloads, with up to 15 gigabyte throughput and a maximum storage capacity of 924 terabytes per chassis.';
                        break;
                    case 'F8 10':
                        speechOutput = 'The Isilon F8 10 is a 4U all-flash scale out NAS platform ideal for high performance computing and unstructured data workloads along with inline compression and deduplication capabilities to deliver extreme efiiciency. The F8 10 cdelivers up to 15 gigabyte throughput with a maximum storage capacity of 924 terabytes per chassis.';
                        break;
                    case 'H4 hundred':
                        speechOutput = 'The Isilon H 400 is a 4U scale out hybdird NAS platform that supports a wide range of unstructured data workloads, with up to 3 gigabyte throughput and a maximum sotrage capacity of 720 terabytes per chassis.';
                        break;
                    case 'H5 hundred':
                        speechOutput = 'The Isilon H 500 is a 4U scale out hybdird NAS platform that supports a wide range of enterprise file workloads, with up to 5 gigabyte throughput and a maximum storage capacity of 720 terabytes per chassis.';
                        break;
                    case 'H 5,600':
                        speechOutput = 'The Isilon H 56 hundred is a 4U scale out hybdird NAS platform that supports a wide range of enterprise file workloads, with up to 8 gigabyte throughput and a maximum storage capacity of 960 terabytes per chassis.';
                        break;
                    case 'H6 hundred':
                        speechOutput = 'The Isilon H 600 is a 4U scale out hybrid NAS platform that supports a wide range of HPC file workloads, with up to 12 gigabyte throughput and a maximum storage capacity of 144 terabytes.';
                        break;
                    case 'A2 hundred':
                    case 'a 200':
                    case 'a two hundred':
                        speechOutput = 'The Isilon A200 is a 4U archive storage NAS platform that supports near-primary data access and robust security options. The A 200 can store up to 720 terabytes with optional encryption and WORM data protection technology.';
                        break;
                    case 'A2 thousand':
                    case 'a 2000':
                    case 'a two thousand':
                        speechOutput = 'The Isilon A2000 is a 4U archive storage NAS platform that supports near-primary data access and robust security options. The A 2000 can store up to 960 terabytes with optional encryption and WORM data protection technology.';
                        break;
                }
                break;
            case 'SC series':
                switch (model) {
                    case '5,020 F':
                        speechOutput = 'The SC 50 20F is a 3U all-flash storage array that encompasses self-optimizing architecture to offer performance and flexibility with a maximum storage capacity of 2.16 petabytes.';
                        break;
                    case '5,020':
                        speechOutput = 'The SC 50 20 is a 3U hybrid storage array that encompasses self-optimizing architecture to offer performance and flexibility with a maximum storage capacity of 2.16 petabytes.';
                        break;
                    case '7,020 F':
                        speechOutput = 'The SC 70 20F is a 3U all-flash storage array that encompasses self-optimizing architecture built for mission critical workloads. The SC 70 20F delivers up to 399,000 IOPS with a maximum storage capacity of 4 petabytes';
                        break;
                    case '7,020':
                        speechOutput = 'The SC 70 20 is a 3U hybrid storage array that encompasses self-optimizing architecture built for mission critical workloads. The SC 70 20 delivers up to 399,000 IOPS with a maximum storage capacity of 4 petabytes';
                        break;
                    case 'V 3,000':
                    case 'V3 thousand':
                        speechOutput = 'The SC V 3,000 is an affordable 3U hybrid storage array that delivers enterprise-class storage features with a maximum capacity of 1 petabyte';
                        break;
                    case '9,000':
                        speechOutput = 'The SC 9000 is the highest-performing model in the SC Series and is ideal for large-scale storage, high-end workloads and distributed enterprise environments. The SC 9000 is available in all-flash or hybrid models with a maximum capacity of 6 petabytes.';
                        break;
                    default:
                        speechOutput = `I'm sorry I didn't catch that. Please make sure the ${model} is a valid SC Series product`;
                        break;
                }
                break;
            case 'power max':
            case 'powermax':
            case 'PowerMax':
                switch (model) {
                    case '2000':
                        speechOutput = 'The powermax 2000 is the entry point for the powermax family composed of multiple bricks that allow you to scale in 13 terabyte increments. The PowerMax 2000 allows the consolidation of block, file, open systems, and IBM i workloads with end-to-end NVME for the highest levels of performance.';
                        break;
                    case '8000':
                    case '8,000':
                        speechOutput = 'The powermax 8000 leads enterprise array performance density with end-to-end NVME and up to 15 million IOPS. The powermax 8000 can scale up to four petabytes and is currently the worlds fastest storage array.'; 
                        break;
                }
                break;
            case 'V max':
            case 'vmax':
            case 'v. max':
                switch (model) {
                    case '250 F':
                    case 'two fifty f.':
                    case '2 50F':
                        speechOutput = 'The V MAX 250F is the scale-out entry model in the VMAX all-flash family built for consolidating block and file workloads on a single storage array with over 1 million IOPS. The 2 50F starts at 11 terabytes of base flash storage and can scale up to 1 petabyte effective capacity';
                        break;
                    case '950 F':
                    case 'nine fifty f.':
                    case '9 50F':
                        speechOutput = 'The V MAX 950F is the enterprise-grade flash-storage array composed of multiple V-bricks. The 950F supports up to 6.7 million IOPS with up to 4 petabyte effective capacity with data reduction and compression.';
                        break;
                }
                break;
            default:
                speechOutput = `It looks like you want ${product} ${model}`;
                break;

        }
        //let speechText = `It looks like you want ${type} ${drink}`;
        return handlerInput.responseBuilder
        .speak(speechOutput)
        .getResponse();
    }
}

////////////////////////////////////////////////////////////////////////////////////////////

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
    //HelpHandler();
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
    //HelpHandler();
    
    console.log(`Original Request was: ${JSON.stringify(request, null, 2)}`);
    console.log(`Error handled: ${error}`);

    return handlerInput.responseBuilder
      .speak('Sorry, I can not understand the command.  Please say again.')
      .reprompt('Sorry, I can not understand the command.  Please say again.')
      .getResponse();
      //.HelpHandler();
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
    //MaxCapacityHandler,
    //CacheSizeHandler,
    //CPUHandler,
    SummaryHandler,
    //ListProductsHandler,
    //ConnectrixSummaryHandler,
    //VMAXSummaryHandler,
    //SCSeriesSummaryHandler,
    //IsilonSummaryHandler,
    //PowermaxSummaryHandler,
    //UnitySummaryHandler,
    //PoweredgeSummaryHandler,
    //HelpMeHandler,
    StartedInProgressHelpMeIntentHandler,
    ListGivenHelpMeIntentHandler,
    ListGivenWithProductHelpMeIntentHandler,
    ProductGivenHelpMeIntentHandler,
    SpecificProductGivenHelpMeIntentHandler,
    CompletedHelpMeIntentHandler,
    CancelStopHandler,
    HelpHandler,
    SessionEndedHandler,
  )
  .addErrorHandlers(ErrorHandler)
  .lambda();