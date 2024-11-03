let currentSong = null;
let isPlaying = false;
let progressBar = document.getElementById('progress-bar');
let timerDisplay = document.getElementById('timer'); 

const songs = [
    { src: 'audio/Cancion1.mp3', title: 'Lose Yourself', artist: 'Eminem', cover: 'Images/Foto1.jpeg' },
    { src: 'audio/Cancion2.mp3', title: 'Hot in Herre', artist: 'Nelly', cover: 'Images/Foto2.jpeg' },
    { src: 'audio/Cancion3.mp3', title: 'Hey Daddy', artist: 'Usher', cover: 'Images/Foto3.jpeg' },
    { src: 'audio/Cancion4.mp3', title: 'Closer', artist: 'Ne-Yo', cover: 'Images/Foto4.jpeg' },
];

const stations = [
    { name: 'Emisora 1', src: 'https://tunein.com/embed/player/s9753/' },
    { name: 'Emisora 2', src: 'https://tunein.com/embed/player/s9459/' }
];

let currentIframeIndex = null;
let sortedSongs = [...songs];
let currentSongIndex = 0;

//Avanza la canción
function nextTrack() {
    if (sortedSongs.length > 0) {
        currentSongIndex = (currentSongIndex + 1) % sortedSongs.length;
        playSong(currentSongIndex);
    }
}

//Retrocede la canción
function prevTrack() {
    if (sortedSongs.length > 0) {
        currentSongIndex = (currentSongIndex - 1 + sortedSongs.length) % sortedSongs.length;
        playSong(currentSongIndex);
    }
}

//Crea la lista de canciones
function createList() {
    const songList = document.getElementById('song-list');
    songList.innerHTML = ''; 

    sortedSongs.forEach((song, index) => {
        const li = document.createElement('li');
        li.innerText = `${song.title} - ${song.artist}`;
        li.onclick = () => {
            currentSongIndex = index;
            playSong(currentSongIndex);
        };
        songList.appendChild(li);
    });

    const stationList = document.getElementById('station-list');
    stationList.innerHTML = ''; 

    //Fumada e la emisora para reproducir
    stations.forEach((station, index) => {
        const li = document.createElement('li');
        li.innerText = station.name;
        li.onclick = () => playStation(index);
        const iframe = document.createElement('iframe');
        iframe.src = station.src;
        iframe.style.width = "100%";
        iframe.style.height = "100px";
        iframe.scrolling = "no";
        iframe.frameBorder = "no";
        li.appendChild(iframe);
        stationList.appendChild(li);
    });
}

//Reproduce la canción seleccionada
function playSong(index) {
    stopIframe();
    stopAudio(); 
    const song = sortedSongs[index];
    currentSong = new Howl({
        src: [song.src],
        volume: 0.5,
        onend: () => console.log('Canción terminada'),
        onplay: () => {
            requestAnimationFrame(updateProgress); 
        }
    });
    document.getElementById('song-title').innerText = song.title;
    document.getElementById('song-artist').innerText = song.artist;
    document.getElementById('song-img').src = song.cover;
    currentSong.play();
    isPlaying = true;
}

//Reproduce la emisora seleccionada
function playStation(index) {
    stopAudio(); 
    const iframes = document.querySelectorAll('iframe');

    if (currentIframeIndex === index) {
        const src = iframes[index].src;
        iframes[index].src = ''; 
        setTimeout(() => {
            iframes[index].src = src; 
        }, 100); 
    } else {
        stopIframe(); 
        currentIframeIndex = index; 
        iframes[index].src = stations[index].src; 
    }
}

//Detiene la canción que se está reproduciendo
function stopAudio() {
    if (currentSong) {
        currentSong.stop();
    }
    isPlaying = false;
}

//Detiene la emisora que se está reproduciendo
function stopIframe() {
    const iframes = document.querySelectorAll('iframe');
    iframes.forEach((iframe) => {
        iframe.src = ''; 
    });
    currentIframeIndex = null; 
}

//Reproduce o pausa la canción que se está reproduciendo
function togglePlayPause() {
    if (currentSong) {
        if (isPlaying) {
            currentSong.pause();
        } else {
            currentSong.play();
            requestAnimationFrame(updateProgress); 
        }
        isPlaying = !isPlaying;
    }
}

//Actualiza la barra de progreso de la canción
function updateProgress() {
    if (currentSong) {
        const progress = currentSong.seek() || 0; 
        const duration = currentSong.duration() || 1; 
        progressBar.value = (progress / duration) * 100; 
        updateTimerDisplay(progress, duration); 

        if (isPlaying) {
            requestAnimationFrame(updateProgress); 
        }
    }
}

//Formatea el tiempo de la canción
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60).toString().padStart(2, '0');
    return `${minutes}:${remainingSeconds}`;
}

//Actualiza el tiempo de la canción
function updateTimerDisplay(currentTime, duration) {
    timerDisplay.innerText = `${formatTime(currentTime)} / ${formatTime(duration)}`;
}

progressBar.addEventListener('input', function() {
    if (currentSong) {
        const duration = currentSong.duration();
        const newTime = (this.value / 100) * duration; 
        currentSong.seek(newTime); 
    }
});

document.getElementById('volume-control').addEventListener('input', function() {
    if (currentSong) {
        currentSong.volume(this.value);
    }
});

//Función para ordenar las canciones por título o artista
function sortSongs() {
    const sortOption = document.getElementById('sort-options').value;

    if (sortOption === 'title') {
        sortedSongs = [...songs].sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortOption === 'artist') {
        sortedSongs = [...songs].sort((a, b) => a.artist.localeCompare(b.artist));
    }

    currentSongIndex = 0; 
    updateSongList(sortedSongs);
}

//Función para actualizar la lista de canciones ordenadas
function updateSongList(sortedSongs) {
    const songList = document.getElementById('song-list');
    songList.innerHTML = ''; 

    sortedSongs.forEach((song, index) => {
        const li = document.createElement('li');
        li.innerText = `${song.title} - ${song.artist}`;
        li.onclick = () => {
            currentSongIndex = index;
            playSong(currentSongIndex);
        };
        songList.appendChild(li);
    });
}

createList();
