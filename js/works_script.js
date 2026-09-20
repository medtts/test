// ツール名と画像ファイル名の対応リスト
const toolIcons = {
    "After Effects": "icon-ae.webp",
    "Illustrator": "icon-ai.webp",
    "Blender": "icon-blender.webp",
    "Maya": "icon-maya.webp",
    "Photoshop": "icon-ps.webp",
    "FireAlpaca": "icon-ps.webp",
    "Unreal Engine": "icon-ue.webp",
    "Unity": "icon-unity.webp",
    "VS Code": "icon-vscode.webp",
    "WordPress": "icon-wp.webp"
};

document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const workId = params.get('id');

    fetch('js/data.json')
        .then(response => response.json())
        .then(dataList => {
            const data = dataList.find(item => item.id === workId);

            if (data) {
                // 基本項目の反映
                document.getElementById('work-title').textContent = data.title;
                document.getElementById('work-category').textContent = data.category;
                // document.getElementById('work-main-img').src = data.image;  
                document.getElementById('work-pc-img').src = data.mac_image;
                document.getElementById('work-sp-img').src = data.sp_image;
                document.getElementById('work-period').textContent = data.period;
                document.getElementById('work-role').textContent = data.role;
                document.getElementById('work-concept').textContent = data.concept;
                document.getElementById('work-client').textContent = data.client || '-';
                document.getElementById('work-purpose').textContent = data.purpose || '-';
                document.getElementById('work-target').textContent = data.target || '-';
                document.getElementById('work-ingenuity').textContent = data.ingenuity || '-';
                document.getElementById('work-challenge').textContent = data.challenge || '-';
                document.getElementById('work-outlook').textContent = data.outlook || '-';
                document.getElementById('work-note').textContent = data.note || '-';
                // リンク先の設定
                const urlBtn = document.getElementById('work-url');
                if (data.url) {
                    urlBtn.href = data.url;
                    urlBtn.style.display = 'inline-block';
                } else {
                    urlBtn.style.display = 'none';
                }

                // ツールアイコンの表示処理（カンマ区切りに対応）
                renderTools(data.tools);
            } else {
                document.getElementById('work-title').textContent = "作品が見つかりませんでした";
            }
        })
        .catch(error => console.error('Error loading data:', error));
});

// ツール表示用関数
function renderTools(toolsString) {
    const container = document.getElementById('work-tools');
    if (!toolsString) return;
    container.innerHTML = '<div class="tool-list"></div>'; // 初期化
    const listContainer = container.querySelector('.tool-list');

    // カンマ区切りで複数のツールを処理
    const tools = toolsString.split(',').map(t => t.trim());

    tools.forEach(toolName => {
        const iconFileName = toolIcons[toolName] || "icon-default.webp";
        
        const item = document.createElement('div');
        item.className = 'tool-item';
        item.innerHTML = `
            <img src="image/${iconFileName}" class="tool-icon" alt="${toolName}">
            <span class="tool-name">${toolName}</span>
        `;
        listContainer.appendChild(item);
    });
}