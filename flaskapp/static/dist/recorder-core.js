
!function(c){"use strict";c.RecorderLM="2018-12-09 19:16";var g=function(){},t={extend:function(e,t){for(var a in e||(e={}),t||(t={}),t)e[a]=t[a];return e}};function w(e){return new a(e)}function a(e){this.set=t.extend({type:"mp3",bitRate:16,sampleRate:16e3,bufferSize:8192,onProcess:g},e)}w.IsOpen=function(){var e=w.Stream;if(e){var t=e.getTracks();if(0<t.length)return"live"==t[0].readyState}return!1},w.prototype=a.prototype={open:function(t,a){if(t=t||g,a=a||g,w.IsOpen())t();else{var e="此浏览器不支持录音",n=c.AudioContext;if(n||(n=c.webkitAudioContext),n){var r=navigator.mediaDevices||{};if(r.getUserMedia||(r=navigator).getUserMedia||(r.getUserMedia=r.webkitGetUserMedia||r.mozGetUserMedia||r.msGetUserMedia),r.getUserMedia){w.Ctx=w.Ctx||new n;var o=function(e){w.Stream=e,t()},s=function(e){var t=e.name||e.message||"";console.error(e),a(/Permission|Allow/i.test(t)?"用户拒绝了录音权限":"无法录音："+t)},i=r.getUserMedia({audio:!0},o,s);i&&i.then&&i.then(o).catch(s)}else a(e)}else a(e)}},close:function(e){e=e||g;this._stop();var t=w.Stream;if(t)for(var a=t.getTracks(),n=0;n<a.length;n++)a[n].stop();w.Stream=0,e()},start:function(){console.log("["+Date.now()+"]Start");var f=this,u=f.set,p=f.buffer=[];if(f.recSize=0,f._stop(),f.state=0,w.IsOpen()){var l,e=w.Ctx,t=f.media=e.createMediaStreamSource(w.Stream),a=f.process=(e.createScriptProcessor||e.createJavaScriptNode).call(e,u.bufferSize,1,1);a.onaudioprocess=function(e){if(1==f.state){var t=e.inputBuffer.getChannelData(0),a=t.length;f.recSize+=a;for(var n=new Int16Array(a),r=0,o=0;o<a;o++){var s=Math.max(-1,Math.min(1,t[o]));s=s<0?32768*s:32767*s,n[o]=s,r+=Math.abs(s)}p.push(n);var i=0;0<(r/=a)&&(i=Math.round(Math.max(0,100*(20*Math.log10(r/32767)+34)/34)));var c=Math.round(f.recSize/w.Ctx.sampleRate*1e3);clearTimeout(l),l=setTimeout(function(){u.onProcess(p,i,c)})}},t.connect(a),a.connect(e.destination),f.state=1}},_stop:function(){var e=this;e.state&&(e.state=0,e.media.disconnect(),e.process.disconnect())},pause:function(e){this.state&&(this.state=e||2)},resume:function(){this.pause(1)},stop:function(a,n){console.log("["+Date.now()+"]Stop"),a=a||g,n=n||g;var e=this,r=e.set;if(e.state){e._stop();var t=e.recSize;if(t){var o=r.sampleRate,s=w.Ctx.sampleRate,i=s/o;1<i?t=Math.floor(t/i):(i=1,o=s,r.sampleRate=o);for(var c=new Int16Array(t),f=0,u=0,p=0,l=e.buffer.length;p<l;p++){for(var v=e.buffer[p],d=f,h=v.length;d<h;)c[u]=v[Math.round(d)],u++,d+=i;f=d-h}var m=Math.round(t/o*1e3);setTimeout(function(){var t=Date.now();e[r.type](c,function(e){console.log("["+Date.now()+"]End",e,m,"编码耗时:"+(Date.now()-t)),a(e,m)},function(e){n(e)})})}else n("未采集到录音")}else n("未开始录音")}},c.Recorder=w}(window),function(){"use strict";Recorder.prototype.enc_wav={stable:!0,testmsg:"比特率取值范围8位、16位"},Recorder.prototype.wav=function(e,t,a){var n=this.set,r=e.length,o=n.sampleRate,s=8==n.bitRate?8:16,i=r*(s/8),c=new ArrayBuffer(44+i),f=new DataView(c),u=0,p=function(e){for(var t=0;t<e.length;t++,u++)f.setUint8(u,e.charCodeAt(t))},l=function(e){f.setUint16(u,e,!0),u+=2},v=function(e){f.setUint32(u,e,!0),u+=4};if(p("RIFF"),v(36+i),p("WAVE"),p("fmt "),v(16),l(1),l(1),v(o),v(o*(s/8)),l(s/8),l(s),p("data"),v(i),8==s)for(var d=0;d<r;d++,u++){var h=e[d];h=parseInt(255/(65535/(h+32768))),f.setInt8(u,h,!0)}else for(d=0;d<r;d++,u+=2)f.setInt16(u,e[d],!0);t(new Blob([f],{type:"audio/wav"}))}}();