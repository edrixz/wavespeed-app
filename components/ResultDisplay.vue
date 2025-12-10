<script setup lang="ts">
defineProps<{
  image: string | null
  loading: boolean
}>()
</script>

<template>
  <div class="flex-1 rounded-xl border border-gray-700 p-4 min-h-[400px] flex items-center justify-center relative overflow-hidden transition-all duration-500 group bg-gray-900"
    :class="{ 'border-blue-500/50': loading }"
  >
    
    <img v-if="image" :src="image" class="max-w-full max-h-[600px] object-contain rounded shadow-2xl z-30 relative animate-fade-in" />
    
    <div v-if="loading" class="absolute inset-0 z-10 overflow-hidden bg-[#ddfeff]">
      
      <div class="absolute inset-0 filter blur-[60px] opacity-90">
        
        <div class="absolute top-[20%] left-[40%] w-[50%] h-[50%] rounded-full mix-blend-screen animate-blob-fast" 
             style="background-color: hsla(28, 100%, 74%, 1); animation-delay: 0s;"></div>

        <div class="absolute top-[0%] left-[80%] w-[60%] h-[60%] rounded-full mix-blend-screen animate-blob-reverse" 
             style="background-color: hsla(189, 100%, 56%, 1); animation-delay: -2s;"></div>

        <div class="absolute top-[50%] left-[0%] w-[50%] h-[50%] rounded-full mix-blend-screen animate-blob-fast" 
             style="background-color: hsla(355, 100%, 93%, 1); animation-delay: -4s;"></div>

        <div class="absolute top-[50%] left-[80%] w-[60%] h-[60%] rounded-full mix-blend-screen animate-blob-reverse" 
             style="background-color: hsla(340, 100%, 76%, 1); animation-delay: -1s;"></div>

        <div class="absolute top-[100%] left-[0%] w-[50%] h-[50%] rounded-full mix-blend-screen animate-blob-fast" 
             style="background-color: hsla(22, 100%, 77%, 1); animation-delay: -3s;"></div>
        
        <div class="absolute top-[100%] left-[80%] w-[70%] h-[70%] rounded-full mix-blend-screen animate-blob-reverse" 
             style="background-color: hsla(242, 100%, 70%, 1); animation-delay: -5s;"></div>

        <div class="absolute top-[0%] left-[0%] w-[60%] h-[60%] rounded-full mix-blend-screen animate-blob-fast" 
             style="background-color: hsla(343, 100%, 76%, 1); animation-delay: -2.5s;"></div>
      </div>

      <div class="absolute inset-0 bg-black/10 z-20"></div>

      <div class="absolute inset-0 flex flex-col items-center justify-center z-30 space-y-4">
        <div class="inline-flex relative">
           <div class="absolute inset-0 rounded-full bg-blue-400 blur-md animate-pulse-fast opacity-50"></div>
           <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-12 h-12 text-blue-100 relative z-10 animate-float-fast">
             <path d="M16.5 7.5h-9v9h9v-9z" opacity=".3"></path>
             <path d="M21.39 10.156l-1.612-1.613a.75.75 0 00-1.06 0l-1.613 1.613a.75.75 0 000 1.06l1.613 1.613a.75.75 0 001.06 0l1.613-1.613a.75.75 0 000-1.06zm-18.78 0l1.613-1.613a.75.75 0 011.06 0l1.613 1.613a.75.75 0 010 1.06l-1.613 1.613a.75.75 0 01-1.06 0l-1.613-1.613a.75.75 0 010-1.06zm10.156 7.992l-1.613 1.613a.75.75 0 01-1.06 0l-1.613-1.613a.75.75 0 010-1.06l1.613-1.613a.75.75 0 011.06 0l1.613 1.613a.75.75 0 010 1.06zm0-15.984l-1.613-1.613a.75.75 0 00-1.06 0l-1.613 1.613a.75.75 0 000 1.06l1.613 1.613a.75.75 0 001.06 0l1.613-1.613a.75.75 0 000-1.06zM12 11a1 1 0 110 2 1 1 0 010-2z"></path>
             <path d="M17.25 12a5.25 5.25 0 11-10.5 0 5.25 5.25 0 0110.5 0z" opacity=".3"></path>
             <path d="M12 15.75a3.75 3.75 0 110-7.5 3.75 3.75 0 010 7.5z"></path>
           </svg>
        </div>
        <p class="text-blue-100/90 text-lg font-medium tracking-wide animate-pulse-fast">AI is dreaming...</p>
      </div>
    </div>

    <div v-else-if="!image" class="text-gray-500 text-center opacity-30 group-hover:opacity-50 transition-opacity z-10">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-20 h-20 mx-auto mb-4"><path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" /></svg>
      <p class="text-base font-medium">Ready to create magic</p>
    </div>

    <a v-if="image" :href="image" download="generated-image.png" class="absolute bottom-4 right-4 bg-gray-900/80 hover:bg-black text-white px-4 py-2 rounded transition-opacity z-40 flex items-center gap-2 text-sm font-medium backdrop-blur-sm border border-white/10 shadow-lg"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4"><path d="M10.75 2.75a.75.75 0 00-1.5 0v8.614L6.295 8.235a.75.75 0 10-1.09 1.03l4.25 4.5a.75.75 0 001.09 0l4.25-4.5a.75.75 0 00-1.09-1.03l-2.955 3.129V2.75z" /><path d="M3.5 12.75a.75.75 0 00-1.5 0v2.5A2.75 2.75 0 004.75 18h10.5A2.75 2.75 0 0018 15.25v-2.5a.75.75 0 00-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5z" /></svg>Download</a>
  </div>
</template>

<style scoped>
/* --- ANIMATION MỚI (Dùng Translate - Bao mượt) --- */

/* Quỹ đạo bay 1: Bay vòng tròn và phóng to thu nhỏ */
@keyframes moveBlobFast {
  0%   { transform: translate(0, 0) scale(1); }
  33%  { transform: translate(50px, -80px) scale(1.2); }
  66%  { transform: translate(-40px, 40px) scale(0.8); }
  100% { transform: translate(0, 0) scale(1); }
}

/* Quỹ đạo bay 2: Bay ngược lại */
@keyframes moveBlobReverse {
  0%   { transform: translate(0, 0) scale(1); }
  33%  { transform: translate(-60px, 60px) scale(0.9); }
  66%  { transform: translate(70px, -30px) scale(1.1); }
  100% { transform: translate(0, 0) scale(1); }
}

/* Gán animation: Chạy nhanh (4s - 6s) */
.animate-blob-fast {
  animation: moveBlobFast 5s infinite ease-in-out;
}

.animate-blob-reverse {
  animation: moveBlobReverse 6s infinite ease-in-out;
}

/* Animation phụ cho Icon */
.animate-float-fast { animation: floatFast 3s ease-in-out infinite; }
@keyframes floatFast { 0%, 100% { transform: translateY(0) scale(1); } 50% { transform: translateY(-10px) scale(1.05); } }

.animate-pulse-fast { animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }

.animate-fade-in { animation: fadeIn 0.8s ease-out; }
@keyframes fadeIn { from { opacity: 0; filter: blur(10px); } to { opacity: 1; filter: blur(0); } }
</style>