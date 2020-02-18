const Alexa = require('ask-sdk-core');
var mysql = require('mysql');

// Text strings
const SKILL_NAME = 'Dell Handler';
const welcomeOutput = "Welcome to Dell Handler. Please state which product line you would like to know about: data storage, converged infrastructure, server, or data protection.";
const welcomeReprompt = "Let me know which product you would like to know about";
const helpOutput = 'Try asking about a specific product or product line.';
const helpReprompt = 'Try asking about a specific product or product line.';

const FALLBACK_MESSAGE = `The ${SKILL_NAME} was unable to process your request. Try asking about a specific product or product line. Is there something I can help you with?`;
const FALLBACK_REPROMPT = 'What can I help you with?';

const connection = mysql.createConnection({
    host: "askemc-test-database.ckn2kh0loqvp.us-east-1.rds.amazonaws.com",
    user: "admin",
    password: "delltech",
    port: "3306",
    database: "innodb",
    debug    :  false
});

let date_ob = new Date();
let date = ("0" + date_ob.getDate()).slice(-2);
let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
let year = date_ob.getFullYear();
let hours = date_ob.getHours();
let minutes = date_ob.getMinutes();
let seconds = date_ob.getSeconds();
var timestamp = (year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds);

const STREAMS = [
  {
    "token": "1",
    "url": 'https://streaming.radionomy.com/-ibizaglobalradio-?lang=en-US&appName=iTunes.m3u',
    "metadata" : {
      "title": "Stream One",
      "subtitle": "A subtitle for stream one",
      "art": {
        "sources": [
          {
            "contentDescription": "example image",
            "url": "https://s3.amazonaws.com/cdn.dabblelab.com/img/audiostream-starter-512x512.png",
            "widthPixels": 512,
            "heightPixels": 512
          }
        ]
      },
      "backgroundImage": {
        "sources": [
          {
            "contentDescription": "example image",
            "url": "https://s3.amazonaws.com/cdn.dabblelab.com/img/wayfarer-on-beach-1200x800.png",
            "widthPixels": 1200,
            "heightPixels": 800
          }
        ]
      }
    }
  }
];

const FallbackHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    console.log("FALLBACK");
    return request.type === 'IntentRequest'
      && request.intent.name === 'AMAZON.FallbackIntent';
  },

  handle(handlerInput) {
        var values = [timestamp, 'FALLBACK', null, null];
        connection.query("INSERT INTO innodb.Lambda (TIMESTAMP,CATEGORY,PRODUCT,MODEL) VALUES(?)", [values], function(err, result, fields) {
            // if any error while executing above query, throw error
            if (err) throw err;
            // if there is no error, you have the result
            console.log(result);
        });
        connection.end();
        
    return handlerInput.responseBuilder
      .speak(FALLBACK_MESSAGE)
      .reprompt(FALLBACK_REPROMPT)
      .getResponse();
  },
};

const PlayStreamIntentHandler = {
  canHandle(handlerInput) {
    //return handlerInput.requestEnvelope.request.type === 'LaunchRequest' ||
      return handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
        (
          handlerInput.requestEnvelope.request.intent.name === 'PlayStreamIntent' ||
          handlerInput.requestEnvelope.request.intent.name === 'AMAZON.ResumeIntent' ||
          handlerInput.requestEnvelope.request.intent.name === 'AMAZON.LoopOnIntent' ||
          handlerInput.requestEnvelope.request.intent.name === 'AMAZON.NextIntent' ||
          handlerInput.requestEnvelope.request.intent.name === 'AMAZON.PreviousIntent' ||
          handlerInput.requestEnvelope.request.intent.name === 'AMAZON.RepeatIntent' ||
          handlerInput.requestEnvelope.request.intent.name === 'AMAZON.ShuffleOnIntent' ||
          handlerInput.requestEnvelope.request.intent.name === 'AMAZON.StartOverIntent'
      );
  },
  handle(handlerInput) {

    let stream = STREAMS[0];

    handlerInput.responseBuilder
      .speak(`starting ${stream.metadata.title}`)
      .addAudioPlayerPlayDirective('REPLACE_ALL', stream.url, stream.token, 0, null, stream.metadata);

    return handlerInput.responseBuilder
      .getResponse();
  },
};

const PlaybackStoppedIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'PlaybackController.PauseCommandIssued' || 
            handlerInput.requestEnvelope.request.type === 'AudioPlayer.PlaybackStopped';
  },
  handle(handlerInput) {
    handlerInput.responseBuilder
      .addAudioPlayerClearQueueDirective('CLEAR_ALL')
      .addAudioPlayerStopDirective();

    return handlerInput.responseBuilder
      .getResponse();
  },
};

const CancelAndStopIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
        && (
          handlerInput.requestEnvelope.request.intent.name === 'AMAZON.StopIntent' ||
          handlerInput.requestEnvelope.request.intent.name === 'AMAZON.PauseIntent' ||
          handlerInput.requestEnvelope.request.intent.name === 'AMAZON.CancelIntent' ||
          handlerInput.requestEnvelope.request.intent.name === 'AMAZON.LoopOffIntent' ||
          handlerInput.requestEnvelope.request.intent.name === 'AMAZON.ShuffleOffIntent'
        );
  },
  handle(handlerInput) {

    handlerInput.responseBuilder
      .addAudioPlayerClearQueueDirective('CLEAR_ALL')
      .addAudioPlayerStopDirective();

    return handlerInput.responseBuilder
      .getResponse();
  },
};

const PlaybackStartedIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'AudioPlayer.PlaybackStarted';
  },
  handle(handlerInput) {
    handlerInput.responseBuilder
      .addAudioPlayerClearQueueDirective('CLEAR_ENQUEUED');

    return handlerInput.responseBuilder
      .getResponse();
  },
};

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
    //const filledSlots = handlerInput.requestEnvelope.request.intent.slots;
    //const slotValues = getSlotValues(filledSlots);
    //let speechOutput = `${speechOutput}`;
    let speechOutput = '';
    
    return responseBuilder
      .speak(speechOutput)
      .getResponse();
  },
};

const StartedInProgressHelpMeIntentHandler = {
    canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === "IntentRequest"
      && handlerInput.requestEnvelope.request.intent.name === "HelpMeIntent"
      //Both of these are tests
      && !handlerInput.requestEnvelope.request.intent.slots.product_type.value
      && !handlerInput.requestEnvelope.request.intent.slots.specific_product.value
      
      && handlerInput.requestEnvelope.request.dialogState !== 'COMPLETED';
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder
        //The speak and addElicitSlotDirective are tests
      .speak('Ok, do you need help with a data storage, converged infrastructure, server, or data protection product?')
      .addDelegateDirective()
      .addElicitSlotDirective('product_type')
      .getResponse();
  }
}
    
//Test
const ListGivenWithProductHelpMeIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === "IntentRequest"
      && handlerInput.requestEnvelope.request.intent.name === "HelpMeIntent"
      //&& handlerInput.requestEnvelope.request.intent.slots.list_or_product.value 
      //&& handlerInput.requestEnvelope.request.intent.slots.list_or_product.value === 'list'
      && handlerInput.requestEnvelope.request.intent.slots.product_type.value
      && !handlerInput.requestEnvelope.request.intent.slots.specific_product.value;

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
            .speak('The products in the data protection line include the power protect, power path, recoverpoint, data domain, and I D P A. Can I help you with a specific product?')
            //.reprompt('List of security, ask for specific product')
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

const SpecificProductGivenHelpMeIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === "IntentRequest"
      && handlerInput.requestEnvelope.request.intent.name === "HelpMeIntent"
      //&& handlerInput.requestEnvelope.request.intent.slots.list_or_product.value 
      //&& handlerInput.requestEnvelope.request.intent.slots.product_type.value
      && handlerInput.requestEnvelope.request.intent.slots.specific_product.value
      && !handlerInput.requestEnvelope.request.intent.slots.specific_model.value

  },
  handle(handlerInput) {
    //const product_class = handlerInput.requestEnvelope.request.intent.slots.product_type.value;
    const product = handlerInput.requestEnvelope.request.intent.slots.specific_product.value;
    var speechOutput;
    var hasSpecificModel = true;
    
    //Multiple-model products -- more than one slot for specific_model
    switch(product) {
        case 'unity':
            speechOutput = 'Ok, the unity is available in the following models: 300, 3 50F, 400, 4 50F, 500, 5 50F, 600, and 6 50F. Which model would you like to know about?';
            break;
        case 'isilon':
        case 'isalon':
        case 'i. salon':
        case 'iceland':
            speechOutput = 'Ok, the isilon is available in the following models: F800, F810, H500, H400, H5600, H600, A200, and A2000. Which model would you like to know about?';
            break;
        case 'PowerMax':
            speechOutput = 'Ok, the powermax is available in the following models: The 2000 and the 8000. Which model would you like to know about?';
            break;
        case 'unity XT':
            speechOutput = 'Ok, the unity XT is available in the following models: 3 80, 3 80F, 4 80, 4 80F, 6 80, 6 80F, 8 80, and 8 80F. Which model would you like to know about?';
            break;
        case 'SC series':
            speechOutput = 'Ok, the S C series is available in the following models: 50 20, 50 20F, 70 20, 70 20F, V 3000, and 9000. Which model would you like to know about?';
            break;
        case 'V max':
        case 'vmax':
        case 'v. max':
            speechOutput = 'Ok, the V max is available in the following models: 2 50F, 9 50F, 100K, 200K, and 400K. Which model would you like to know about?';
            break;
        case 'connectrix':
            speechOutput = 'Ok, the Connectrix is available in the following models: B series switch, B series director, MDS series switch, and MDS series director. Which model would you like to know about?';
            break;
        case 'power protect':
            speechOutput = 'Ok, the power protect is available in the following models: DD 33 hundred, DD 69 hundred, DD 94 hundred, DD 99 hundred, and X 400. Which model would you like to know about?';
            break;
        case 'data domain':
            speechOutput = 'Ok, the data domain is available in the following models: DD 63 hundred, DD 68 hundred, DD 93 hundred, and DD 98 hundred. Which model would you like to know about?';
            break;
        case 'IDPA':
            speechOutput = 'Ok, the I D P A, or Integrated Data Protection Appliance, is available in the following models: DP 44 hundred, DP 58 hundred, DP 83 hundred, and DP 88 hundred. Which model would you like to know about?';
            break;
            
        //Single model products -- No slot for specific_model
        case 'recover point':
            hasSpecificModel = false;
            speechOutput = 'Dell EMC RecoverPoint replication software provides the continuous data protection you need to recover any application, on any supported storage array, in any location, to any point in time. Recoverpoint helps you meet your recovery point objectives and recovery time objectives with instant access to data. Recoverpoint for virtual machines can also be used to enable quick recovery of VMware virtual machines to any point in time.';
            break;
        case 'power path':
            hasSpecificModel = false;
            speechOutput = 'Dell EMC Powerpath is a family of software products that ensures consistent application availability and performance across I/O paths on physical and virtual platforms. The powerpath software provides automated path management and tools that enable you to satisfy aggressive service-level agreements without investing in additional infrastructure. Dell EMC PowerPath VE is compatible with VMware vSphere and Microsoft Hyper-V-based virtual environments and can be used together with the PowerPath software to perform critical functions in both physical and virtual environments.';
            break;
        case 'extreme IO':
            hasSpecificModel = false;
            speechOutput = 'The extreme IO is an all-flash storage array built for modernizing block storage workloads and offers 4 to 20 times data reduction using inline deduplication, compression, XtremIO Virtual Copies, and thin provisioning. The extreme IO can scale up from a 5U one brick cluster up to a 20U four brick cluster.';
            break;
        case 'ECS':
            hasSpecificModel = false;
            speechOutput = 'The ECS is the leading object-storage platform from Dell EMC, and has been engineered to support both traditional and next-generation workloads. The ECS supports object, file, and HDFS protocols and offers configurations from 60 terabytes to 8.6 petabytes in a single rack.';
            break;
        case 'powervault':
            hasSpecificModel = false;
            speechOutput = 'The PowerVault ME4 Series is a next-generation entry-level block storage array purpose-built and optimized for price-sensitive SAN & DAS environments. The powervault is available in either 2U or 5U form factors and can house up to Up to 336 drives with 4PB raw capacity';
            break;
            
        //Default case -- if user requests a product that's unavailable or mispronounces a product
        default:
            switch(Math.floor(Math.random() * 5)+1) {
                case 1:
                    speechOutput = 'Sorry, I didnt catch that';
                    break;
                case 2:
                    speechOutput = 'Im sorry, could you repeat that?';
                    break;
                case 3:
                    speechOutput = 'Hmm, I dont understand. Please try again.';
                    break;
                case 4:
                    speechOutput = 'I didnt get all that. Try speaking clearly.';
                    break;
                case 5:
                    speechOutput = 'Im not sure what youre saying. Please try again.';
                    break;
                }
                break;
    }
            
    if (hasSpecificModel === true) {
        return handlerInput.responseBuilder
            .speak(speechOutput)
            .addElicitSlotDirective('specific_model')
            .getResponse();
    } else {
        const product_class = handlerInput.requestEnvelope.request.intent.slots.product_type.value;
        var values = [timestamp, product_class, product, null];
        connection.query("INSERT INTO innodb.Lambda (TIMESTAMP,CATEGORY,PRODUCT,MODEL) VALUES(?)", [values], function(err, result, fields) {
            // if any error while executing above query, throw error
            if (err) throw err;
            // if there is no error, you have the result
            console.log(result);
        });
        connection.end();
        return handlerInput.responseBuilder
            .speak(speechOutput)
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
        //const l_or_p = handlerInput.requestEnvelope.request.intent.slots.list_or_product.value;
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
            case 'power protect':
                switch (model) {
                    case 'DD 3,300':
                        speechOutput = 'The PowerProtect DD3300 is a 2U protection storage appliance that allows for cloud-enabled protection. The DD 33 hundred is an entry-level backup appliance designed for SMB IT environments and enterprise remote or branch offices with a starting capacity of 4 terabytes.';
                        break;
                    case 'DD 6,900':
                        speechOutput = 'The PowerProtect DD 69 hundred is a 2U protection storage appliance built for consolidating backups, archiving, and disaster recovery. The DD 69 hundred has a throughput up to 33 terabytes an hour, with up to 18.7 petabytes of local logical capacity extendable to 56.1 petabytes with Cloud Tier.';
                        break;
                    case 'DD 9,400':
                        speechOutput = 'The PowerProtect DD 94 hundred is a 2U protection storage appliance built for consolidating backups, archiving, and disaster recovery. The DD 94 hundred has a throughput up to 57 terabytes an hour, with up to 49.9 petabytes of local logical capacity extendable to 149.8 petabytes with Cloud Tier.';
                        break;
                    case 'DD 9,900':
                        speechOutput = 'The PowerProtect DD 99 hundred is a 2U protection storage appliance built for consolidating backups, archiving, and disaster recovery. The DD 99 hundred has a throughput up to 94 terabytes an hour, with up to 81.3 petabytes of local logical capacity extendable to 211 petabytes with Cloud Tier.';
                        break;
                    case 'X 400':
                        speechOutput = 'The PowerProtect X 400 is available in both all-flash and hybrid models. The all-flash model has a maximum throughput of 105 terabytes an hour with four cubes, or 27 terabytes an hour with a single cube. The hybrid model has a maximum throughput of 40 terabytes with four cubes, or 9.8 terabytes an hour with a single cube.';
                        break;
                }
                break;
            case 'data domain':
                switch (model) {
                    case 'DD 6,300':
                        speechOutput = 'The Data Domain DD 63 hundred is a capable, cost-effective protection storage system built for backup, archive, and disaster recovery ideal for small to midrange data centers. The DD 63 hundred has a throughput of up to 24 terabytes per hour, with up to 8.9 petabytes of local logical capacity.';
                        break;
                    case 'DD 6,800':
                        speechOutput = 'The Data Domain DD 68 hundred is a capable, cost-effective protection storage system built for backup, archive, and disaster recovery ideal for midrange enterprise workloads. The DD 68 hundred has a throughput of up to 32 terabytes per hour, with up to 14.4 petabytes of local logical capacity expandable to 43.2 petabytes with optional cloud tier software.';
                        break;
                    case 'DD 9,300':
                        speechOutput = 'The Data Domain DD 93 hundred is a capable, cost-effective protection storage system built for backup, archive, and disaster recovery ideal for large enterprise workloads. The DD 93 hundred has a throughput of up to 41 terabytes per hour, with up to 36 petabytes of local logical capacity expandable to 108 petabytes with optional Cloud Tier Software.';
                        break;
                    case 'DD 9,800':
                        speechOutput = 'The Data Domain DD 98 hundred is a capable, cost-effective protection storage system built for backup, archive, and disaster recovery ideal for the most demanding enterprise workloads. The DD 98 hundred has a throughput of up to 68 terabytes per hour, with up to 50 petabytes of local logical capacity expandable to 150 petabytes with optional Cloud Tier Software.';
                        break;
                }
                break;
            case 'IDPA':
                switch (model) {
                    case 'DP 4,400':
                        speechOutput = 'The I D P A DP 44 hundred is a converged appliance that combines backup, replication, deduplication, analytics, and restore, as well as DR and long-term retention to the Cloud. The DP 44 hundred has a maximum throughput of 14.4 terabytes per hour and is ideal for small and mid-size organizations and remote or branch offices of larger enterprises.';
                        break;
                    case 'DP 5,800':
                        speechOutput = 'The I D P A DP 58 hundred is a converged appliance that combines backup, replication, deduplication, analytics, and restore, as well as DR and long-term retention to the Cloud. The DP 58 hundred has a maximum throughput of 32 terabytes per hour and is ideal for mid-size enterprises looking to simplify and strengthen data protection';
                        break;
                    case 'DP 8,300':
                        speechOutput = 'The I D P A DP 83 hundred is a converged appliance that combines backup, replication, deduplication, analytics, and restore, as well as DR and long-term retention to the Cloud. The DP 83 hundred has a maximum throughput of 41 terabytes per hour and is ideal for large enterprises.';
                        break;
                    case 'DP 8,800':
                        speechOutput = 'The I D P A DP 88 hundred is a converged appliance that combines backup, replication, deduplication, analytics, and restore, as well as DR and long-term retention to the Cloud. The DP 88 hundred has a maximum throughput of 68 terabytes per hour and is ideal for large enterprises that require the highest service level agreements.';
                        break;
                }
                break;
            default:
                switch(Math.floor(Math.random() * 5)+1) {
                    case 1:
                        speechOutput = 'Sorry, I didnt catch that';
                        break;
                    case 2:
                        speechOutput = 'Im sorry, could you repeat that?';
                        break;
                    case 3:
                        speechOutput = 'Hmm, I dont understand. Please try again.';
                        break;
                    case 4:
                        speechOutput = 'I didnt get all that. Try speaking clearly.';
                        break;
                    case 5:
                        speechOutput = 'Im not sure what youre saying. Please try again.';
                        break;
                }
                //speechOutput = `It looks like you want ${product} ${model}`;
                break;

        }
        const product_class = handlerInput.requestEnvelope.request.intent.slots.product_type.value;
        var values = [timestamp, product_class, product, model];
        connection.query("INSERT INTO innodb.Lambda (TIMESTAMP,CATEGORY,PRODUCT,MODEL) VALUES(?)", [values], function(err, result, fields) {
            // if any error while executing above query, throw error
            if (err) throw err;
            // if there is no error, you have the result
            console.log(result);
        });
        
        connection.end();
        
        console.log("GOOD JOB - THIS.EVENT = " + JSON.stringify(this.event));
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
    FallbackHandler,
    PlayStreamIntentHandler,
    PlaybackStoppedIntentHandler,
    CancelAndStopIntentHandler,
    PlaybackStartedIntentHandler,
    LaunchRequestHandler,
    InProgressHandler,
    CompletedHandler,
    StartedInProgressHelpMeIntentHandler,
    ListGivenWithProductHelpMeIntentHandler,
    SpecificProductGivenHelpMeIntentHandler,
    CompletedHelpMeIntentHandler,
    CancelStopHandler,
    HelpHandler,
    SessionEndedHandler,
  )
  .addErrorHandlers(ErrorHandler)
  .lambda();