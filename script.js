console.log("🚀 Study Buddy Connect - Starting...");
let publicMessages = [
    {
        id: 1,
        userId: "system",
        userName: "System",
        userBatch: "Admin",
        content: "Welcome to Study Buddy Connect Public Chat! Be respectful to everyone.",
        time: "10:00 AM",
        type: "system"
    },
    {
        id: 2,
        userId: "alex",
        userName: "Alex Sharma",
        userBatch: "2023-2027",
        content: "Hi everyone! Anyone studying DSA for tomorrow's test?",
        time: "10:15 AM",
        type: "user"
    },
    {
        id: 3,
        userId: "priya",
        userName: "Priya Patel",
        userBatch: "2022-2026",
        content: "Yes Alex! I'm studying graphs. Need help with anything?",
        time: "10:18 AM",
        type: "user"
    },
    {
        id: 4,
        userId: "rohan",
        userName: "Rohan Kumar",
        userBatch: "2023-2027",
        content: "Can someone explain Dijkstra's algorithm?",
        time: "10:25 AM",
        type: "user"
    }
];

let onlineUsers = 25;
const BAD_WORDS = ['abuse', 'hate', 'stupid', 'idiot', 'dumb', 'fool']; // Words to block

let studentProfile = {
    name: "Guest Student",
    universityId: "",
    batch: "",
    branch: "",
    phone: "",
    email: "",
    subjects: ["DSA"]
};

let buddiesData = [
    {
        id: 1,
        name: "Alex Sharma",
        avatar: "A",
        batch: "2023-2027",
        subjects: ["DSA", "Web Dev", "DBMS"],
        status: "online"
    },
    {
        id: 2,
        name: "Priya Patel",
        avatar: "P",
        batch: "2022-2026",
        subjects: ["OS", "CN", "Web Dev"],
        status: "online"
    },
    {
        id: 3,
        name: "Rohan Kumar",
        avatar: "R",
        batch: "2023-2027",
        subjects: ["DSA", "DBMS", "Algorithms"],
        status: "offline"
    },
    {
        id: 4,
        name: "Tanya Singh",
        avatar: "T",
        batch: "2022-2026",
        subjects: ["Web Dev", "React", "JavaScript"],
        status: "online"
    }
];

let chatMessages = {
    1: [
        { sender: "Alex Sharma", text: "Hi! Need help with DSA?", time: "10:30 AM", type: "received" },
        { sender: "You", text: "Yes, binary trees traversal", time: "10:32 AM", type: "sent" },
        { sender: "Alex Sharma", text: "I can explain all three traversals", time: "10:33 AM", type: "received" }
    ],
    2: [
        { sender: "Priya Patel", text: "Hey! Web Dev help?", time: "11:15 AM", type: "received" }
    ]
};

let currentChatUser = null;

document.addEventListener('DOMContentLoaded', function() {
    console.log("📱 Initializing Study Buddy Connect...");
    
    setupProfileSystem();
    
    loadBuddies();
    
    setupChatSystem();
    
    setupVideoCall();
    
    setupNavigation();
    
    setupButtons();

    setupPublicChat();
    
    console.log("✅ App initialized successfully!");
    showNotification("🎓 Welcome to Study Buddy Connect!");
});


function setupProfileSystem() {
    console.log("👤 Setting up profile system...");
    

    const savedProfile = localStorage.getItem('studentProfile');
    if (savedProfile) {
        studentProfile = JSON.parse(savedProfile);
        updateProfileDisplay();
    }
    
    document.getElementById('editProfileBtn').addEventListener('click', function() {
        showProfileForm();
    });
    document.getElementById('cancelEditBtn').addEventListener('click', function() {
        hideProfileForm();
    });
    
    document.getElementById('studentProfileForm').addEventListener('submit', function(e) {
        e.preventDefault();
        saveProfile();
    });
    
    document.getElementById('createProfileBtn').addEventListener('click', function() {
        showProfileForm();
        document.getElementById('profile').scrollIntoView({ behavior: 'smooth' });
    });
}

function showProfileForm() {
    document.getElementById('studentName').value = studentProfile.name;
    document.getElementById('universityId').value = studentProfile.universityId;
    document.getElementById('batch').value = studentProfile.batch;
    document.getElementById('branch').value = studentProfile.branch;
    document.getElementById('phone').value = studentProfile.phone;
    document.getElementById('email').value = studentProfile.email;
    
    const checkboxes = document.querySelectorAll('input[name="subjects"]');
    checkboxes.forEach(checkbox => {
        checkbox.checked = studentProfile.subjects.includes(checkbox.value);
    });
    
    // Show form, hide display
    document.getElementById('profileForm').style.display = 'block';
    document.getElementById('profileDisplay').style.display = 'none';
}

function hideProfileForm() {
    document.getElementById('profileForm').style.display = 'none';
    document.getElementById('profileDisplay').style.display = 'block';
}

function saveProfile() {
    // Get values from form
    studentProfile.name = document.getElementById('studentName').value;
    studentProfile.universityId = document.getElementById('universityId').value;
    studentProfile.batch = document.getElementById('batch').value;
    studentProfile.branch = document.getElementById('branch').value;
    studentProfile.phone = document.getElementById('phone').value;
    studentProfile.email = document.getElementById('email').value;
    
    // Get selected subjects
    const selectedSubjects = [];
    document.querySelectorAll('input[name="subjects"]:checked').forEach(checkbox => {
        selectedSubjects.push(checkbox.value);
    });
    studentProfile.subjects = selectedSubjects;
    
    // Save to localStorage
    localStorage.setItem('studentProfile', JSON.stringify(studentProfile));
    
    // Update display
    updateProfileDisplay();
    
    // Hide form
    hideProfileForm();
    
    // Show success message
    showNotification("✅ Profile saved successfully!");
    console.log("Profile saved:", studentProfile);
}

function updateProfileDisplay() {
    document.getElementById('displayName').textContent = studentProfile.name;
    document.getElementById('displayId').textContent = studentProfile.universityId || "Not Set";
    document.getElementById('displayBatch').textContent = `Batch: ${studentProfile.batch || "Not Set"}`;
    document.getElementById('displayBatchYear').textContent = studentProfile.batch || "2023-2027";
    document.getElementById('displayBranch').textContent = studentProfile.branch || "CSE";
    document.getElementById('displayPhone').textContent = studentProfile.phone || "+91 XXXXX XXXXX";
    document.getElementById('displayEmail').textContent = studentProfile.email || "student@jiit.ac.in";
    
    // Update avatar with first letter
    const avatar = document.getElementById('displayAvatar');
    if (studentProfile.name && studentProfile.name !== "Guest Student") {
        avatar.innerHTML = studentProfile.name.charAt(0).toUpperCase();
    }
}

// ===== 2. STUDY BUDDIES =====
function loadBuddies() {
    console.log("👥 Loading study buddies...");
    
    const grid = document.getElementById('buddiesGrid');
    if (!grid) return;
    
    grid.innerHTML = '';
    
    buddiesData.forEach(buddy => {
        const buddyCard = document.createElement('div');
        buddyCard.className = 'buddy-card';
        buddyCard.innerHTML = `
            <div class="buddy-avatar">${buddy.avatar}</div>
            <h4>${buddy.name}</h4>
            <p class="buddy-batch">${buddy.batch}</p>
            <div class="buddy-subjects">
                ${buddy.subjects.map(subject => `<span class="subject-tag">${subject}</span>`).join('')}
            </div>
            <div class="buddy-actions">
                <button class="btn-chat" data-id="${buddy.id}">
                    <i class="fas fa-comment"></i> Chat
                </button>
                <button class="btn-video-call" data-id="${buddy.id}">
                    <i class="fas fa-video"></i> Video
                </button>
            </div>
        `;
        
        grid.appendChild(buddyCard);
    });
    
    // Add event listeners to buttons
    document.querySelectorAll('.btn-chat').forEach(btn => {
        btn.addEventListener('click', function() {
            const buddyId = parseInt(this.dataset.id);
            startChat(buddyId);
        });
    });
    
    document.querySelectorAll('.btn-video-call').forEach(btn => {
        btn.addEventListener('click', function() {
            const buddyId = parseInt(this.dataset.id);
            startVideoCall(buddyId);
        });
    });
}

// ===== 3. CHAT SYSTEM =====
function setupChatSystem() {
    console.log("💬 Setting up chat system...");
    
    // Load chat users
    loadChatUsers();
    
    // Send message button
    document.getElementById('sendMessageBtn').addEventListener('click', sendMessage);
    
    // Enter key to send
    document.getElementById('messageInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') sendMessage();
    });
}

function loadChatUsers() {
    const usersContainer = document.getElementById('chatUsers');
    if (!usersContainer) return;
    
    usersContainer.innerHTML = '';
    
    buddiesData.forEach(buddy => {
        const userDiv = document.createElement('div');
        userDiv.className = `chat-user ${buddy.status} ${currentChatUser === buddy.id ? 'active' : ''}`;
        userDiv.dataset.id = buddy.id;
        userDiv.innerHTML = `
            <div class="user-avatar">${buddy.avatar}</div>
            <div class="user-info">
                <h4>${buddy.name}</h4>
                <span class="user-status ${buddy.status}">${buddy.status}</span>
            </div>
        `;
        
        userDiv.addEventListener('click', function() {
            selectChatUser(buddy.id);
        });
        
        usersContainer.appendChild(userDiv);
    });
}

function selectChatUser(userId) {
    currentChatUser = userId;
    
    // Update active state
    document.querySelectorAll('.chat-user').forEach(user => {
        user.classList.remove('active');
        if (parseInt(user.dataset.id) === userId) {
            user.classList.add('active');
        }
    });
    
    // Load messages
    loadChatMessages(userId);
    
    // Enable chat input
    document.getElementById('messageInput').disabled = false;
    document.getElementById('sendMessageBtn').disabled = false;
    
    // Update chat header
    const buddy = buddiesData.find(b => b.id === userId);
    if (buddy) {
        document.querySelector('.chat-header h3').innerHTML = `<i class="fas fa-user"></i> Chat with ${buddy.name}`;
    }
}

function loadChatMessages(userId) {
    const messagesContainer = document.getElementById('chatMessages');
    if (!messagesContainer) return;
    
    messagesContainer.innerHTML = '';
    
    const messages = chatMessages[userId] || [];
    
    messages.forEach(msg => {
        const msgDiv = document.createElement('div');
        msgDiv.className = `message ${msg.type}`;
        
        if (msg.type === 'received') {
            msgDiv.innerHTML = `
                <div class="message-sender">${msg.sender}</div>
                <div class="message-text">${msg.text}</div>
                <div class="message-time">${msg.time}</div>
            `;
        } else {
            msgDiv.innerHTML = `
                <div class="message-text">${msg.text}</div>
                <div class="message-time">${msg.time}</div>
            `;
        }
        
        messagesContainer.appendChild(msgDiv);
    });
    
    // Scroll to bottom
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function sendMessage() {
    const input = document.getElementById('messageInput');
    const text = input.value.trim();
    
    if (!text || !currentChatUser) return;
    
    // Add message to UI
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const messagesContainer = document.getElementById('chatMessages');
    
    const msgDiv = document.createElement('div');
    msgDiv.className = 'message sent';
    msgDiv.innerHTML = `
        <div class="message-text">${text}</div>
        <div class="message-time">${time}</div>
    `;
    
    messagesContainer.appendChild(msgDiv);
    
    // Save to chat history
    if (!chatMessages[currentChatUser]) {
        chatMessages[currentChatUser] = [];
    }
    chatMessages[currentChatUser].push({
        sender: "You",
        text: text,
        time: time,
        type: "sent"
    });
    
    // Clear input
    input.value = '';
    input.focus();
    
    // Auto-reply after 1 second
    setTimeout(() => {
        const buddy = buddiesData.find(b => b.id === currentChatUser);
        if (!buddy) return;
        
        const replies = [
            "Thanks for your message!",
            "I can help with that.",
            "Let me check and get back to you.",
            "Great question! Let's discuss."
        ];
        const reply = replies[Math.floor(Math.random() * replies.length)];
        const replyTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        const replyDiv = document.createElement('div');
        replyDiv.className = 'message received';
        replyDiv.innerHTML = `
            <div class="message-sender">${buddy.name}</div>
            <div class="message-text">${reply}</div>
            <div class="message-time">${replyTime}</div>
        `;
        
        messagesContainer.appendChild(replyDiv);
        
        // Save auto-reply
        chatMessages[currentChatUser].push({
            sender: buddy.name,
            text: reply,
            time: replyTime,
            type: "received"
        });
        
        // Scroll to bottom
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }, 1000);
    
    // Scroll to bottom
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function startChat(buddyId) {
    // Scroll to chat section
    document.getElementById('chat').scrollIntoView({ behavior: 'smooth' });
    
    // Select the user
    setTimeout(() => {
        selectChatUser(buddyId);
    }, 500);
}

// ===== 4. VIDEO CALL =====
function setupVideoCall() {
    console.log("🎥 Setting up video call...");
    
    document.getElementById('startVideoBtn').addEventListener('click', function() {
        startJitsiCall();
    });
}

function startJitsiCall() {
    showNotification("🎬 Starting video call with Jitsi Meet...", "info");
    
    // Create video call window
    const roomName = 'study-buddy-' + Math.random().toString(36).substring(7);
    const videoUrl = `https://meet.jit.si/${roomName}`;
    
    // Open in new window
    window.open(videoUrl, 'Video Call', 'width=1200,height=800');
    
    // Show local demo
    showVideoDemo();
}

function showVideoDemo() {
    showNotification("📹 Video call started! Check the new window.", "success");
    
    // Local demo fallback
    const placeholder = document.querySelector('.video-placeholder');
    placeholder.innerHTML = `
        <i class="fas fa-video fa-4x"></i>
        <h3>Video Call Active</h3>
        <p>Connected to Jitsi Meet</p>
        <div class="video-demo-grid">
            <div class="video-box">
                <i class="fas fa-user fa-2x"></i>
                <p>You</p>
            </div>
            <div class="video-box">
                <i class="fas fa-user fa-2x"></i>
                <p>Study Buddy</p>
            </div>
        </div>
        <button class="btn-video" onclick="endVideoCall()">
            <i class="fas fa-phone-slash"></i> End Call
        </button>
    `;
}

function endVideoCall() {
    showNotification("📞 Video call ended", "info");
    const placeholder = document.querySelector('.video-placeholder');
    placeholder.innerHTML = `
        <i class="fas fa-video fa-4x"></i>
        <h3>Start Video Call</h3>
        <p>Click below to start a Jitsi video call</p>
        <button class="btn-video" id="startVideoBtn">
            <i class="fas fa-play-circle"></i> Start Video Call
        </button>
    `;
    // Reattach event listener
    document.getElementById('startVideoBtn').addEventListener('click', startJitsiCall);
}

function startVideoCall(buddyId) {
    const buddy = buddiesData.find(b => b.id === buddyId);
    if (buddy) {
        showNotification(`🎥 Starting video call with ${buddy.name}...`, "info");
        startJitsiCall();
    }
}

// ===== 5. NAVIGATION =====
function setupNavigation() {
    console.log("📍 Setting up navigation...");
    
    // Smooth scroll for nav links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                // Update active nav link
                document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
                this.classList.add('active');
                
                // Scroll to section
                targetSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
    
    // Login button
    document.querySelectorAll('.btn-login').forEach(btn => {
        btn.addEventListener('click', function() {
            showNotification("🔑 Login feature would open here", "info");
        });
    });
    
    // Register button
    document.querySelectorAll('.btn-register').forEach(btn => {
        btn.addEventListener('click', function() {
            showNotification("📝 Registration feature would open here", "info");
        });
    });
}

// ===== 6. BUTTONS =====
function setupButtons() {
    // Explore button
    const exploreBtn = document.getElementById('exploreBtn');
    if (exploreBtn) {
        exploreBtn.addEventListener('click', function() {
            document.getElementById('find').scrollIntoView({ behavior: 'smooth' });
            showNotification("🔍 Finding study buddies for you...", "info");
        });
    }
    
    // Watch demo button
    const watchDemoBtn = document.getElementById('watchDemoBtn');
    if (watchDemoBtn) {
        watchDemoBtn.addEventListener('click', function() {
            showNotification("🎬 Playing demo video...", "info");
            // In real app, would open video
            alert("Demo video would play here");
        });
    }
}

// ===== HELPER FUNCTIONS =====
function showNotification(message, type = 'info') {
    console.log(`📢 ${type}: ${message}`);
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = `
        <span>${message}</span>
        <button class="close-notification">&times;</button>
    `;
    
    // Add styles if not exists
    if (!document.querySelector('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                background: white;
                padding: 15px 20px;
                border-radius: 10px;
                box-shadow: 0 10px 30px rgba(0,0,0,0.2);
                display: flex;
                align-items: center;
                gap: 15px;
                z-index: 9999;
                animation: slideIn 0.3s ease-out;
                border-left: 5px solid #4361ee;
                max-width: 400px;
            }
            .close-notification {
                background: none;
                border: none;
                font-size: 20px;
                cursor: pointer;
                color: #999;
            }
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(notification);
    
    // Auto-remove after 3 seconds
    setTimeout(() => {
        if (notification.parentNode) notification.remove();
    }, 3000);
    
    // Close button
    notification.querySelector('.close-notification').addEventListener('click', () => {
        notification.remove();
    });
}
// ===== PUBLIC CHAT SYSTEM =====
function setupPublicChat() {
    console.log("🌐 Setting up public chat...");
    
    // Load messages
    loadPublicMessages();
    
    // Update user name in input
    updatePublicChatUser();
    
    // Send message button
    const sendBtn = document.getElementById('sendPublicMessage');
    if (sendBtn) {
        sendBtn.addEventListener('click', sendPublicMessage);
    }
    
    // Enter key to send
    const messageInput = document.getElementById('publicMessageInput');
    if (messageInput) {
        messageInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') sendPublicMessage();
        });
    }
    
    // Refresh button
    const refreshBtn = document.getElementById('refreshChat');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', function() {
            loadPublicMessages();
            updateOnlineCount();
            showNotification("🔄 Chat refreshed!", "info");
        });
    }
    
    // Clear button
    const clearBtn = document.getElementById('clearChat');
    if (clearBtn) {
        clearBtn.addEventListener('click', function() {
            if (confirm("Clear all public messages? System messages will remain.")) {
                publicMessages = publicMessages.filter(msg => msg.type === 'system');
                localStorage.removeItem('studyBuddyPublicMessages');
                loadPublicMessages();
                showNotification("🧹 Public chat cleared!", "info");
            }
        });
    }
    
    // Update online count every 30 seconds
    setInterval(updateOnlineCount, 30000);
}

function updatePublicChatUser() {
    const userName = studentProfile.name || "Guest";
    const userNameElement = document.getElementById('currentUserName');
    if (userNameElement) {
        userNameElement.textContent = userName;
    }
}

function loadPublicMessages() {
    const container = document.getElementById('publicMessages');
    if (!container) return;
    
    // Load saved messages from localStorage
    const savedMessages = localStorage.getItem('studyBuddyPublicMessages');
    if (savedMessages) {
        publicMessages = JSON.parse(savedMessages);
    }
    
    container.innerHTML = '';
    
    publicMessages.forEach(message => {
        const messageDiv = document.createElement('div');
        
        if (message.type === 'system') {
            messageDiv.className = 'system-message';
            messageDiv.innerHTML = `
                <i class="fas fa-info-circle"></i>
                ${message.content}
            `;
        } else {
            messageDiv.className = 'public-message';
            messageDiv.innerHTML = `
                <div class="public-message-header">
                    <div class="message-user">
                        <div class="user-avatar-small">${message.userName.charAt(0)}</div>
                        <div>
                            <div class="user-name">${message.userName}</div>
                            <span class="user-batch">${message.userBatch}</span>
                        </div>
                    </div>
                    <div class="message-time">${message.time}</div>
                </div>
                <div class="message-content">${message.content}</div>
            `;
        }
        
        container.appendChild(messageDiv);
    });
    
    // Scroll to bottom
    container.scrollTop = container.scrollHeight;
}

function sendPublicMessage() {
    const input = document.getElementById('publicMessageInput');
    if (!input) return;
    
    const content = input.value.trim();
    
    if (!content) return;
    
    // Check for abusive language
    if (containsBadWords(content)) {
        showModerationWarning();
        input.value = '';
        return;
    }
    
    // Check message length
    if (content.length > 500) {
        showNotification("❌ Message too long! Keep under 500 characters.", "error");
        return;
    }
    
    // Create message object
    const newMessage = {
        id: publicMessages.length + 1,
        userId: "user_" + Date.now(),
        userName: studentProfile.name || "Guest Student",
        userBatch: studentProfile.batch || "JIIT Student",
        content: content,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: 'user'
    };
    
    // Add to messages
    publicMessages.push(newMessage);
    
    // Save to localStorage
    localStorage.setItem('studyBuddyPublicMessages', JSON.stringify(publicMessages));
    
    // Update UI
    loadPublicMessages();
    
    // Clear input
    input.value = '';
    input.focus();
    
    // Auto-reply from random "student" after 2 seconds
    setTimeout(sendAutoReply, 2000);
    
    // Update online count
    updateOnlineCount();
}

function containsBadWords(text) {
    const lowerText = text.toLowerCase();
    return BAD_WORDS.some(word => lowerText.includes(word));
}

function showModerationWarning() {
    const container = document.getElementById('publicMessages');
    if (!container) return;
    
    const warning = document.createElement('div');
    warning.className = 'moderation-warning';
    warning.innerHTML = `
        <i class="fas fa-exclamation-triangle"></i>
        <strong>Message blocked:</strong> Please avoid inappropriate language. Be respectful to all students.
    `;
    container.appendChild(warning);
    
    // Scroll to warning
    container.scrollTop = container.scrollHeight;
    
    // Remove after 5 seconds
    setTimeout(() => {
        if (warning.parentNode) {
            warning.remove();
        }
    }, 5000);
    
    showNotification("⚠️ Message blocked due to inappropriate language", "warning");
}

function sendAutoReply() {
    const autoReplies = [
        {
            name: "Study Helper",
            batch: "Senior",
            content: "Great question! I can help with that."
        },
        {
            name: "DSA Expert",
            batch: "2022-2026",
            content: "I was studying that topic too. Let's discuss!"
        },
        {
            name: "Web Dev Mentor",
            batch: "2021-2025",
            content: "Check the documentation, it explains it well."
        },
        {
            name: "Math Tutor",
            batch: "2023-2027",
            content: "Anyone else needs help with calculus?"
        }
    ];
    
    const reply = autoReplies[Math.floor(Math.random() * autoReplies.length)];
    
    const autoMessage = {
        id: publicMessages.length + 1,
        userId: "auto_" + Date.now(),
        userName: reply.name,
        userBatch: reply.batch,
        content: reply.content,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: 'user'
    };
    
    publicMessages.push(autoMessage);
    localStorage.setItem('studyBuddyPublicMessages', JSON.stringify(publicMessages));
    loadPublicMessages();
}

function updateOnlineCount() {
    // Random online users between 20-50 for demo
    onlineUsers = Math.floor(Math.random() * 30) + 20;
    const onlineCountElement = document.getElementById('onlineCount');
    if (onlineCountElement) {
        onlineCountElement.textContent = onlineUsers;
    }
}

// ===== DEBUG FUNCTIONS =====
window.debug = {
    resetProfile: function() {
        localStorage.removeItem('studentProfile');
        studentProfile = {
            name: "Guest Student",
            universityId: "",
            batch: "",
            branch: "",
            phone: "",
            email: "",
            subjects: ["DSA"]
        };
        updateProfileDisplay();
        showNotification("🧹 Profile reset to default", "info");
    },
    testChat: function() {
        startChat(1);
    },
    testVideo: function() {
        startVideoCall(2);
    }
};

console.log("🎉 Study Buddy Connect Ready!");
console.log("💡 Type 'debug.resetProfile()' to reset profile");
console.log("💡 Type 'debug.testChat()' to test chat");
console.log("💡 Type 'debug.testVideo()' to test video call");