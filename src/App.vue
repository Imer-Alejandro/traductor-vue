<script>
//import library of comunication 
import axios from 'axios';


import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';
export default {
  
  mounted(){
    //listen the event that comes from App.vue and execute this method
   
    
  },

  data(){
    return{
      state_conection:navigator.onLine,
      text_origen:'Texto en español aqui...',
      text_destino:'Texto traducido a ingles aqui...',
      datos:{
        texto:'',
        origen:'es',
        destino:'en',
      },
      traducion:'',
      bar_loanding:false
    }
  },
  methods:{

    leerTexto(texto) {
  const utterance = new SpeechSynthesisUtterance(texto);

  // Obtener la lista de voces disponibles
  const vocesDisponibles = speechSynthesis.getVoices();

  if (this.datos.destino != 'es') {
      // Filtrar las voces para obtener la voz en inglés con acento británico
      const vozInglesBritanico = vocesDisponibles.find(voz => voz.lang === 'en-GB');

    // Establecer la voz en el objeto Utterance
    if (vozInglesBritanico) {
      utterance.voice = vozInglesBritanico;
    }
  }else{
      // Filtrar las voces para obtener la voz en español
      const vozEspanol = vocesDisponibles.find(voz => voz.lang === 'es');

      // Establecer la voz en el objeto Utterance
      if (vozEspanol) {
        utterance.voice = vozEspanol;
      }
  }
  // Leer el texto
  speechSynthesis.speak(utterance);
},

    getTranslation(){
      if (this.datos.texto !='') {
        this.bar_loanding = true;
        axios.post("https://api-traductor-idiomas.vercel.app/translate",this.datos)
          .then((response)=>{
              this.traducion=response.data
              toast.success("se obtubo  la traducción correctamente");
              // Llamada al método para leer el texto traducido
            
          })
          .catch((err)=>{
              console.error(err)
              this.traducion='error en la traducción'
              toast.error("no se pudo  realizar la traducción");
              if(!navigator.onLine){
                toast.info('No hay conexión a internet');
              }
          })
          .finally(()=>{
            this.bar_loanding= false;
          })

      }else{
        toast.warning("ingrese un texto para realizar una traducción");
      }

    },
    chageIdioma(){
      if (this.datos.origen=='es') {
        this.datos.origen='en';
        this.datos.destino='es';
        this.text_origen='Texto en ingles aqui...';
        this.text_destino='Texto traducido a español aqui...'
        this.traducion=''
        this.datos.texto=''
      }else{
        this.datos.origen='es';
        this.datos.destino='en';
        this.text_origen='Texto en español aqui... ';
        this.text_destino='Texto traducido a ingles aqui...'
        this.traducion=''
        this.datos.texto=''
      }
    },
    clipboardText(texto) {
      // Intenta acceder al portapapeles usando la API Clipboard
      navigator.clipboard.writeText(texto)
        .then(() => {
          console.log("Texto copiado al portapapeles:", texto);
        })
        .catch((err) => {
          console.error("Error al copiar al portapapeles:", err);
        });
    },
  

  }

}
</script>

<template>
  <div class="  w-full h-[100%] overflow-x-hidden overflow-hidden">

    <div v-show="bar_loanding"  class="  w-full h-[100vh] bg-[#444d639c] fixed  z-[70] ">
        <div class="w-[70%] ml-[15%] rounded-md h-[80px] bg-white mt-[80%]">
            <header class="w-full justify-center flex flex-row h-full items-center">
                <img class=" w-[50px] mr-[10px] h-[50px] order-1" src="./assets/icons8-hilandero.gif" alt="" srcset="">
                <h2 class="text-[1.2rem]   order-2">Procesando...</h2>
            </header>
        </div>
        
      </div>
    
    <section class="w-[100%] h-[100%] overflow-hidden p-2">
    <div class="flex flex-row absolute   overflow-auto w-[260px] h-[60px] ">
      <div class="order-1   mr-[20px] ">
        <label  class="text-[#707070] text-[0.8rem]"  for="">idioma origen</label>
        <select disabled v-model="datos.origen" class="border-[0.5px] p-1 w-full rounded border-[#707070]  outline-none" name="" id="">
        <option value="es">español</option>
        <option value="en">ingles</option>
      </select>
      </div>

      <div class="order-2  ">
        <label class="text-[#707070] text-[0.8rem]" for="">idioma destino</label>
        <select disabled v-model="datos.destino" class="border-[0.5px]  p-1 w-full border-[#707070] rounded outline-none" name="" id="">
        <option value="en">ingles</option>
        <option value="es">español</option>
      </select>
      </div>
    </div>
    <button  @click="chageIdioma()" class="w-[60px]  absolute flex items-center justify-center ml-[78%] h-[60px] rounded bg-[#5196CB] shadow-md">
      <img  class="w-[30px] h-[30px] " src="./assets/circulo.png" alt="" srcset="">
    </button>
    <div class="w-full  h-[250px] mt-[70px] ">
      <label class="text-[0.9rem] mb-[5px]" for="texto-entrada">{{ text_origen }}</label>
      <textarea v-model="datos.texto" class=" p-2   resize-none w-full h-full rounded outline-none focus:border-[#5196CB] border-[1px] border-black" id="texto-entrada" 
      maxlength="200" cols="30" rows="10"   >
      </textarea>
    </div>
    <button @click="getTranslation();" class="mt-[35px]  transition mb-[15px]  active:bg-[#5da8e2] bg-[#5196CB] w-full h-[70px]
     shadow-md rounded text-center text-white text-[1.5rem]  font-light">traducir texto</button>
     <div class="w-full h-[250px]  mb-[20px]">
     <button @click="leerTexto(this.traducion)" class="outline-none absolute ml-[83%]  rounded w-[40px] h-[40px] flex items-center justify-center mt-[56%]">
      <img class="w-[30px] h-[30px]" src="./assets/alto-volumen.png" alt="" srcset="">
     </button>
        <button @click="clipboardText(traducion)" class="copy">
          <span data-text-end="Copied!" data-text-initial="Copy to clipboard" class="tooltip"></span>
          <span>
            <svg xml:space="preserve" style="enable-background:new 0 0 512 512" viewBox="0 0 6.35 6.35" y="0" x="0" height="20" width="20" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" xmlns="http://www.w3.org/2000/svg" class="clipboard">
              <g>
                <path fill="currentColor" d="M2.43.265c-.3 0-.548.236-.573.53h-.328a.74.74 0 0 0-.735.734v3.822a.74.74 0 0 0 .735.734H4.82a.74.74 0 0 0 .735-.734V1.529a.74.74 0 0 0-.735-.735h-.328a.58.58 0 0 0-.573-.53zm0 .529h1.49c.032 0 .049.017.049.049v.431c0 .032-.017.049-.049.049H2.43c-.032 0-.05-.017-.05-.049V.843c0-.032.018-.05.05-.05zm-.901.53h.328c.026.292.274.528.573.528h1.49a.58.58 0 0 0 .573-.529h.328a.2.2 0 0 1 .206.206v3.822a.2.2 0 0 1-.206.205H1.53a.2.2 0 0 1-.206-.205V1.529a.2.2 0 0 1 .206-.206z"></path>
              </g>
            </svg>
            <svg xml:space="preserve" style="enable-background:new 0 0 512 512" viewBox="0 0 24 24" y="0" x="0" height="18" width="18" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" xmlns="http://www.w3.org/2000/svg" class="checkmark">
              <g>
                <path data-original="#000000" fill="currentColor" d="M9.707 19.121a.997.997 0 0 1-1.414 0l-5.646-5.647a1.5 1.5 0 0 1 0-2.121l.707-.707a1.5 1.5 0 0 1 2.121 0L9 14.171l9.525-9.525a1.5 1.5 0 0 1 2.121 0l.707.707a1.5 1.5 0 0 1 0 2.121z"></path>
              </g>
            </svg>
          </span>
        </button>
      <label class="text-[0.9rem] mb-[5px]" for="texto-salida">{{text_destino}}</label>
      <textarea v-model="traducion" disabled class="resize-none p-2  w-full h-full rounded outline-none focus:border-[#5196CB] border-[1px] border-black" id="texto-salida" 
       cols="30" rows="10">
      </textarea>
     </div>
  </section>
  </div>

</template>

<style scoped>

.main{
  overflow: hidden;
}

/* tooltip settings 👇 */

.copy {
  /* button */
  --button-bg: #302c2c6b;
  --button-hover-bg: #747474;
  --button-text-color: #d4d4d4;
  --button-hover-text-color: #8bb9fe;
  --button-border-radius: 10px;
  --button-diameter: 36px;
  --button-outline-width: 1px;
  --button-outline-color: rgb(168, 168, 168);
  /* tooltip */
  --tooltip-bg: #f4f3f3;
  --toolptip-border-radius: 4px;
  --tooltip-font-family: Menlo, Roboto Mono, monospace;
  /* 👆 this field should not be empty */
  --tooltip-font-size: 12px;
  /* 👆 this field should not be empty */
  --tootip-text-color: rgb(50, 50, 50);
  --tooltip-padding-x: 7px;
  --tooltip-padding-y: 7px;
  --tooltip-offset: 8px;
  /* --tooltip-transition-duration: 0.3s; */
  /* 👆 if you need a transition, 
  just remove the comment,
  but I didn't like the transition :| */
}

.copy {
  box-sizing: border-box;
  width: var(--button-diameter);
  height: var(--button-diameter);
  border-radius: var(--button-border-radius);
  background-color: var(--button-bg);
  color: var(--button-text-color);
  border: none;
  cursor: pointer;
  position: absolute;
  margin-left: 82%;
  margin-top: 30px;
  outline: none;
}

.tooltip {
  position: absolute;
  opacity: 0;
  visibility: 0;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  white-space: nowrap;
  font: var(--tooltip-font-size) var(--tooltip-font-family);
  color: var(--tootip-text-color);
  background: var(--tooltip-bg);
  padding: var(--tooltip-padding-y) var(--tooltip-padding-x);
  border-radius: var(--toolptip-border-radius);
  pointer-events: none;
  transition: all var(--tooltip-transition-duration) cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.tooltip::before {
  content: attr(data-text-initial);
}

.tooltip::after {
  content: "";
  position: absolute;
  bottom: calc(var(--tooltip-padding-y) / 2 * -1);
  width: var(--tooltip-padding-y);
  height: var(--tooltip-padding-y);
  background: inherit;
  left: 50%;
  transform: translateX(-50%) rotate(45deg);
  z-index: -999;
  pointer-events: none;
}

.copy svg {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.checkmark {
  display: none;
}

/* actions */

.copy:hover .tooltip,
.copy:focus:not(:focus-visible) .tooltip {
  opacity: 1;
  visibility: visible;
  top: calc((100% + var(--tooltip-offset)) * -1);
}

.copy:focus:not(:focus-visible) .tooltip::before {
  content: attr(data-text-end);
}

.copy:focus:not(:focus-visible) .clipboard {
  display: none;
}

.copy:focus:not(:focus-visible) .checkmark {
  display: block;
}

.copy:hover,
.copy:focus {
  background-color: var(--button-hover-bg);
}

.copy:active {
  outline: var(--button-outline-width) solid var(--button-outline-color);
}

.copy:hover svg {
  color: var(--button-hover-text-color);
}
</style>
