class Sort {

    arr;
    
    audiosrc = new AudioContext();

    oscillator = [];

    sound_volume = 0.6;

    sound_end = 0.045;

    sound_pitch_high = 1500;

    sound_pitch_low = 60;

    play_tone = function (num,slot) {

        if (typeof slot === 'number') {

            this.oscillator[slot].volume.gain.value = this.sound_volume / 2;
    
            this.oscillator[slot].frequency.value = (((num*num)/(this.arr.length*this.arr.length))*this.sound_pitch_high)+this.sound_pitch_low;

        } else {

            this.oscillator[0].volume.gain.value = this.sound_volume / 2;
    
            this.oscillator[0].frequency.value = (((num*num)/(this.arr.length*this.arr.length))*this.sound_pitch_high)+this.sound_pitch_low;
    
            this.oscillator[1].frequency.value = 0;

        }

    }

    stop_tones = function () {
    
        this.oscillator[0].frequency.value = 0;
        this.oscillator[1].frequency.value = 0;

        this.oscillator[0].volume.gain.exponentialRampToValueAtTime(0.0001,this.audiosrc.currentTime + this.sound_end);
        this.oscillator[0].volume.gain.setTargetAtTime(0,this.audiosrc.currentTime+this.sound_end,this.audiosrc.currentTime+this.sound_end+0.003);

        this.oscillator[1].volume.gain.exponentialRampToValueAtTime(0.0001,this.audiosrc.currentTime + this.sound_end);
        this.oscillator[1].volume.gain.setTargetAtTime(0,this.audiosrc.currentTime+this.sound_end,this.audiosrc.currentTime+this.sound_end+0.003);

    }

    delay = 15;

    values = {
        compares: 0,
        swaps: 0,
        reversals: 0,
        writes: 0,
        writes_aux: 0,
        accesses: 0,
        reset: function () {
            for (const v of Object.keys(this)) {
                if (!["parent","reset","temp","temp_reset","reload"].includes(v)) this[v] = 0;
            }
            this.parent.update();
        },
        temp_reset: function () {
            this.temp = {};
            for (const v of Object.keys(this)) {
                if (!["parent","reset","temp","temp_reset","reload"].includes(v)) this.temp[v] = this[v];
            }
            this.reset();
        },
        reload: function () {
            for (const v of Object.keys(this.temp)) {
                this[v] = this.temp[v];
            }
            delete this.temp;
            this.parent.update();
        }
    }

    update = function () {};

    queue = [];

    interval = [];

    time_paused = 0;

    paused = true;

    cancelled = false;

    set_delay = async function (delay) {

        if (typeof delay === "number") this.delay = delay;
        if (this.paused) return;

        while (this.interval.length > 0) clearInterval(this.interval.shift());

        for (let i = 0; i < 10/Math.max(0.05,this.delay); i++) {

            this.interval.push(setInterval(() => {if (this.queue[0] && typeof this.queue[0][0] === "function") this.queue.shift()[0]()},Math.max(10,this.delay)));

        }

    }

    stop = function () {
        this.stop_tones();
        this.paused = true;
        while (this.interval.length > 0) clearInterval(this.interval.shift());
    }

    start = function () {
        this.paused = false;
        this.set_delay();
    }

    end_sort = function () {

        if (this.cancelled || !this.running_sort) {
            this.stop_tones();
            this.oscillator[0].stop();
            this.oscillator[1].stop();
            return;
        }

        this.cancelled = true;

        while (this.interval.length > 0) clearInterval(this.interval.shift());

        this.paused = true;

        this.arr.pointers.forEach((v,i) => {this.arr.pointers[i] = false});
        this.arr.forEach((v,i) => {this.update(i)});
        
        if (this.queue[0] && typeof this.queue[0][1] === "function") this.queue[0][1]();
        this.running_sort = undefined;

        this.paused = false;

        this.verify();

    }

    toggle_pause = function () {
        if (this.paused && Date.now() - this.time_paused > 10) { //this.time_paused is to prevent weird double pause stuff
            this.start();
            this.time_paused = Date.now();
        }
        else if (!this.paused && Date.now() - this.time_paused > 10) {
            this.stop();
            this.time_paused = Date.now();
        }
    }

    wait_delay = async () => {

        return new Promise((resolve,reject) => this.queue.push([resolve,reject]))

        // return new Promise(resolve => setTimeout(resolve, this.delay));
    }

    get = async function (i) {

        this.play_tone(this.arr[i]);

        this.arr.pointers[i] = true;

        this.update(i);

        await this.wait_delay();

        this.values.accesses++;

        this.arr.pointers[i] = false;

        this.update(i);

        return this.arr[i];
    }

    compare = {
        greater: function (a,b) {
            this.parent.values.compares++;
            this.parent.update();
            return a > b;
        },
        less: function (a,b) {
            this.parent.values.compares++;
            this.parent.update();
            return a < b;
        },
        greater_eq: function (a,b) {
            this.parent.values.compares++;
            this.parent.update();
            return a >= b;
        },
        less_eq: function (a,b) {
            this.parent.values.compares++;
            this.parent.update();
            return a <= b;
        },
        equal: function (a,b) {
            this.parent.values.compares++;
            this.parent.update();
            return a === b;
        },
        min: function (i, end) {
    
            let min = this.parent[i] || this.parent[0];
            end = Math.min((end || this.parent.arr.length - 1),this.parent.arr.length - 1);
    
            while (i <= end) {
                if (this.less(this.parent.arr[i],min)) min = this.parent.arr[i];
                i++;
            }
    
            return min;
        },
        max: function (i, end) {
    
            let max = this.parent[i] || this.parent[0];
            end = Math.min((end || this.parent.arr.length - 1),this.parent.arr.length - 1);
    
            while (i <= end) {
                if (this.greater(this.parent.arr[i],max)) max = this.parent.arr[i];
                i++;
            }
    
            return max;
        }
    }

    compareind = {
        greater: async function (a,b) {

            this.parent.play_tone(this.parent.arr[a],0);
            this.parent.play_tone(this.parent.arr[b],1);

            this.parent.arr.pointers[a] = true;
            this.parent.arr.pointers[b] = true;

            this.parent.update(a);
            this.parent.update(b);

            await this.parent.wait_delay();
            
            this.parent.values.compares++;

            this.parent.arr.pointers[a] = false;
            this.parent.arr.pointers[b] = false;

            this.parent.update(a);
            this.parent.update(b);

            return this.parent.arr[a] > this.parent.arr[b];
        },
        less: async function (a,b) {

            this.parent.play_tone(this.parent.arr[a],0);
            this.parent.play_tone(this.parent.arr[b],1);

            this.parent.arr.pointers[a] = true;
            this.parent.arr.pointers[b] = true;

            this.parent.update(a);
            this.parent.update(b);

            await this.parent.wait_delay();
            
            this.parent.values.compares++;

            this.parent.arr.pointers[a] = false;
            this.parent.arr.pointers[b] = false;

            this.parent.update(a);
            this.parent.update(b);

            return this.parent.arr[a] < this.parent.arr[b];
        },
        greater_eq: async function (a,b) {

            this.parent.play_tone(this.parent.arr[a],0);
            this.parent.play_tone(this.parent.arr[b],1);

            this.parent.arr.pointers[a] = true;
            this.parent.arr.pointers[b] = true;

            this.parent.update(a);
            this.parent.update(b);

            await this.parent.wait_delay();
            
            this.parent.values.compares++;

            this.parent.arr.pointers[a] = false;
            this.parent.arr.pointers[b] = false;

            this.parent.update(a);
            this.parent.update(b);

            return this.parent.arr[a] >= this.parent.arr[b];
        },
        less_eq: async function (a,b) {

            this.parent.play_tone(this.parent.arr[a],0);
            this.parent.play_tone(this.parent.arr[b],1);

            this.parent.arr.pointers[a] = true;
            this.parent.arr.pointers[b] = true;

            this.parent.update(a);
            this.parent.update(b);

            await this.parent.wait_delay();
            
            this.parent.values.compares++;

            this.parent.arr.pointers[a] = false;
            this.parent.arr.pointers[b] = false;

            this.parent.update(a);
            this.parent.update(b);

            return this.parent.arr[a] <= this.parent.arr[b];
        },
        equal: async function (a,b) {

            this.parent.play_tone(this.parent.arr[a],0);
            this.parent.play_tone(this.parent.arr[b],1);

            this.parent.arr.pointers[a] = true;
            this.parent.arr.pointers[b] = true;

            this.parent.update(a);
            this.parent.update(b);

            await this.parent.wait_delay();
            
            this.parent.values.compares++;

            this.parent.arr.pointers[a] = false;
            this.parent.arr.pointers[b] = false;

            this.parent.update(a);
            this.parent.update(b);

            return this.parent.arr[a] === this.parent.arr[b];
        },
        verify: async function (i, end) {
            end = Math.min(Math.floor(end || this.parent.arr.length-1),this.parent.arr.length-1);
            for (i = Math.max(Math.floor(i || 0),0); i < end; i++) if (await this.greater(i,i+1)) return false;
            return true;
        },
        min: async function (i, end) {

            i = Math.max(Math.floor(i || 0),0);
    
            let min = i;
            end = Math.min(Math.max(0,Math.floor(typeof end == "number" ? end : this.parent.arr.length-1)),this.parent.arr.length-1);
    
            while (i <= end) {
                if (await this.less(i,min)) min = i;
                i++;
            }
    
            return min;
    
        },
        max: async function (i, end) {

            i = Math.max(Math.floor(i || 0),0);
    
            let max = i;
            end = Math.min(Math.max(0,Math.floor(typeof end == "number" ? end : this.parent.arr.length-1)),this.parent.arr.length-1);
    
            while (i <= end) {
                if (await this.greater(i,max)) max = i;
                i++;
            }
    
            return max;
            
        },
        min_max: async function (i, end) {

            i = Math.max(Math.floor(i || 0),0);
    
            let min = i, max = i;
            end = Math.min(Math.max(0,Math.floor(typeof end == "number" ? end : this.parent.arr.length-1)),this.parent.arr.length-1);
    
            while (i <= end) {
                if (await this.less(i,min)) min = i;
                else if (await this.greater(i,max)) max = i;
                i++;
            }
    
            return [min,max];
            
        }
    }

    write = {
        swap: async function (a,b) {

            this.parent.play_tone(this.parent.arr[a],0);
            this.parent.play_tone(this.parent.arr[b],1);

            this.parent.arr.pointers[a] = true;
            this.parent.arr.pointers[b] = true;

            this.parent.update(a);
            this.parent.update(b);

            await this.parent.wait_delay();

            this.parent.values.swaps++;
            this.parent.values.writes += 2;

            this.parent.arr.pointers[a] = false;
            this.parent.arr.pointers[b] = false;

            [this.parent.arr[a],this.parent.arr[b]] = [this.parent.arr[b],this.parent.arr[a]];

            this.parent.update(a);
            this.parent.update(b);
        },
        write: async function (a,b) {

            this.parent.play_tone(b);

            this.parent.arr.pointers[a] = true;

            this.parent.update(a);

            await this.parent.wait_delay();

            this.parent.values.writes++;
            this.parent.arr.pointers[a] = false;
            
            this.parent.arr[a] = b;

            this.parent.update(a);
        },
        overwrite: async function (a,b) {

            this.parent.play_tone(b);

            this.parent.arr.pointers[a] = true;

            this.parent.update(a);

            await this.parent.wait_delay();

            this.parent.values.writes++;
            this.parent.arr.pointers[a] = false;

            this.parent.arr[a] = this.parent.arr[b];

            this.parent.update(a);
        },
        invert: async function (start,end) {
    
            start = Math.min(Math.max(0,Math.floor(start || 0)),this.parent.arr.length-1);
            end = Math.min(Math.max(0,Math.floor(typeof end == "number" ? end : this.parent.arr.length-1)),this.parent.arr.length-1);
    
            this.parent.values.reversals++;
    
            for (;start <= end;await this.swap(start,end),start++,end--);
    
        },
        randomize: async function (start,end) {
    
            start = Math.min(Math.max(0,Math.floor(start || 0)),this.parent.arr.length);
            end = Math.min(Math.max(0,Math.floor(end || this.parent.arr.length)),this.parent.arr.length);
        
            let ran_i;
        
            for (let cur_i = start; cur_i < end; cur_i++) {
        
                ran_i = cur_i + Math.floor(Math.random() * (end - cur_i));
                
                await this.swap(cur_i,ran_i);
        
            }
            
        }
    }

    constructor (length, update, finish_func) {

        length = Math.min(Math.max(Math.round(length || 128),4),512);

        this.arr = Array.from({length}, (v, i) => i);

        this.arr.pointers = this.arr.map(() => {return false})

        for (const v of Object.keys(this)) {
            if (typeof this[v] == "object") this[v].parent = this;
        }

        this.update = update(this.arr,this.values);

        this.arr.forEach((v,i) => {this.update(i)});

        this.finish_func = finish_func;


        //Sound oscillators

        const oscillator_wave = 'triangle';

        //Oscillator 1

        this.oscillator.push(this.audiosrc.createOscillator());

        this.oscillator[0].volume = this.audiosrc.createGain();

        this.oscillator[0].connect(this.oscillator[0].volume);

        this.oscillator[0].volume.connect(this.audiosrc.destination);

        this.oscillator[0].volume.gain.value = 0;

        this.oscillator[0].type = oscillator_wave;

        this.oscillator[0].start();

        //Oscillator 2

        this.oscillator.push(this.audiosrc.createOscillator());

        this.oscillator[1].volume = this.audiosrc.createGain();

        this.oscillator[1].connect(this.oscillator[1].volume);

        this.oscillator[1].volume.connect(this.audiosrc.destination);

        this.oscillator[1].volume.gain.value = 0;

        this.oscillator[1].type = oscillator_wave;

        this.oscillator[1].start();

    }

    initiate = function (func,{base} = {}) {
        this.running_sort = func;
        this.running_sort(base).then(() => {this.end_sort()}).catch((e)=>{
            if (!this.cancelled) console.error(e);
        })
        this.start();
    }

    shuffle = async function (type) {

        this.set_delay(1500 / this.arr.length);

        this.start();

        switch (type) {

            default: //Random
                
                await this.write.randomize();

                break;

            case 0: //Random
                
                await this.write.randomize();

                break;

            case 1: //Sorted

                break;

            case 2: //Reversed

                await this.write.invert();

                break;

            case 3: //Heapified

                this.set_delay(3500/(this.arr.length*Math.log2(this.arr.length)));

                for (let x = this.arr.length - 1; x >= 0; x--) {

                    let i = x;

                    let children = [(i*2)+1,(i*2)+2];
            
                    while (children[0] < this.arr.length && (await this.compareind.less(i,children[0]) || (children[1] < this.arr.length ? await this.compareind.less(i,children[1]) : false))) {
                    
                        let greater = (children[1] < this.arr.length && await this.compareind.less(...children)) ? children[1] : children[0];
                        await this.write.swap(i,greater);
                        i = greater;
                        children = [(i*2)+1,(i*2)+2];
                    
                    }
        
                }

                break;

            case 4: //Mostly combed

                this.set_delay(1000 / this.arr.length);
                
                await this.write.randomize(); //Randomize, then comb

                this.set_delay(1000/(this.arr.length*Math.log2(this.arr.length)));
        
                let gap = this.arr.length;
        
                while (gap > Math.max(16,this.arr.length * 0.125)) {
        
                    if (gap > 1) gap = Math.floor(gap / 1.3);
        
                    for (let i = 0; i < this.arr.length - gap; i++) {
        
                        if (await this.compareind.greater(i, i + gap)) await this.write.swap(i, i + gap);
        
                    }
                
                }

                break;

            case 5: //Final radix pass

                this.set_delay(1250/this.arr.length);

                let base = Math.floor(this.arr.length / 2);
    
                let buckets = Array.from({length: base}, () => {return []});
        
                for (let i = 0; i < this.arr.length; i++) {
                    buckets[Math.floor((await this.get(i))) % base].push(this.arr[i]);
                    this.values.writes_aux++;
                }
    
                const combined = buckets.reduce((a,b) => {return a.concat(b)});
                
                for (let i = 0; i < combined.length; i++) {
                    await this.write.write(i,combined[i]);
                }

                break;

            case 6: //Randomized inputs

                this.set_delay(2000/this.arr.length);
                
                for (let i = 0; i < this.arr.length; i++) {
                    await this.write.write(i,Math.random()*(this.arr.length-1));
                }

                break;

            case 7: //Many similar

                this.set_delay(1000 / this.arr.length);

                let bucket_size = Math.ceil(this.arr.length/16);
                
                for (let i = 0; i < this.arr.length; i++) {
                    await this.write.write(i,(Math.floor(i/bucket_size)+1)*bucket_size);
                }

                this.set_delay(1500 / this.arr.length);

                await this.write.randomize();

                break;
        }

        this.stop();

        this.values.reset();
        
    }

    verify = async function () {

        this.values.temp_reset();

        this.set_delay(750 / this.arr.length);

        this.arr.verifying = true;

        this.arr.verified = true;

        for (let i = 0; i < this.arr.length-1; i++) {
            if (await this.compareind.greater(i,i+1)) this.arr.verified = false;
        }

        await this.wait_delay();

        if (!this.arr.verified) alert("Sort failed!");
        
        this.arr.verifying = false;

        this.stop();

        this.values.reload();

        this.arr.forEach((v,i) => {this.update(i)});

        this.finish_func();

    }

}