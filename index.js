document.addEventListener('DOMContentLoaded', () => {
    const urlForm = document.getElementById('url-form');
    const urlInput = document.getElementById('url-input');
    const submitButton = document.getElementById('submit-button');
    const loader = document.getElementById('loader');
    const errorContainer = document.getElementById('error-container');
    const resultsContainer = document.getElementById('results-container');

    const extractVideoId = (url) => {
        if (!url) return null;
        const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
        const match = url.match(regex);
        return match ? match[1] : null;
    };
    
    const showLoader = (isLoading) => {
        submitButton.disabled = isLoading;
        urlInput.disabled = isLoading;
        loader.classList.toggle('hidden', !isLoading);
    };

    const showError = (message) => {
        errorContainer.textContent = message;
        errorContainer.classList.remove('hidden');
    };

    const clearState = () => {
        errorContainer.classList.add('hidden');
        resultsContainer.classList.add('hidden');
        resultsContainer.innerHTML = '';
    };

    const fetchMockDownloadOptions = (videoId) => {
        console.log(`Simulating fetch for video ID: ${videoId}`);
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve([
                    { quality: '1080p', format: 'MP4', size: '152.3 MB', type: 'video' },
                    { quality: '720p', format: 'MP4', size: '85.1 MB', type: 'video' },
                    { quality: '480p', format: 'MP4', size: '43.8 MB', type: 'video' },
                    { quality: '360p', format: 'MP4', size: '25.2 MB', type: 'video' },
                    { quality: '128kbps', format: 'MP3', size: '4.5 MB', type: 'audio' },
                ]);
            }, 1500);
        });
    };

    const renderResults = (videoId, options) => {
        const videoHtml = `
            <div class="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl shadow-lg overflow-hidden">
                <div class="p-6">
                    <div class="flex flex-col md:flex-row gap-6">
                        <div class="md:w-1/3 flex-shrink-0">
                            <img
                                src="https://img.youtube.com/vi/${videoId}/hqdefault.jpg"
                                alt="Video Thumbnail"
                                class="w-full h-auto rounded-lg shadow-md aspect-video object-cover"
                            />
                        </div>
                        <div class="md:w-2/3 flex flex-col gap-3">
                            ${options.map(option => `
                                <a href="#" onclick="alert('This is a demo. In a real app, this would start the download.'); return false;" class="flex items-center justify-between w-full px-4 py-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors duration-200 group">
                                    <div class="flex items-center gap-3">
                                        <span class="font-semibold text-red-400 text-sm w-16 text-center">${option.format}</span>
                                        <span class="font-medium text-gray-200">${option.quality}</span>
                                        <span class="text-sm text-gray-400">${option.size}</span>
                                    </div>
                                    <div class="flex items-center gap-2 text-gray-400 group-hover:text-white">
                                        <span class="hidden sm:inline">Download</span>
                                        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                        </svg>
                                    </div>
                                </a>
                            `).join('')}
                        </div>
                    </div>
                </div>
            </div>
        `;
        resultsContainer.innerHTML = videoHtml;
        resultsContainer.classList.remove('hidden');
    };

    urlForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        clearState();

        const url = urlInput.value.trim();
        if (!url) {
            showError('Please enter a YouTube URL.');
            return;
        }

        const videoId = extractVideoId(url);
        if (!videoId) {
            showError('Invalid YouTube URL. Please check and try again.');
            return;
        }

        showLoader(true);
        try {
            const options = await fetchMockDownloadOptions(videoId);
            renderResults(videoId, options);
        } catch (err) {
            console.error(err);
            showError('Could not fetch download links. Please try again later.');
        } finally {
            showLoader(false);
        }
    });
});