/* =========================
   IDEA LAB SHARED ASSISTANT
========================= */

(function () {

    const WORKER_URL =
        "https://idea-lab-assistant.akhilawasthi1383.workers.dev/assistant";

    /* =========================
       DETECT CURRENT SIMULATION
    ========================= */

    const page =
        window.location.pathname
            .split("/")
            .pop()
            .toLowerCase();

    const simulations = {

        "wave-propagation-3d.html": {
            name: "Wave Propagation Simulation in 3D",
            category: "Waves",
            controls: [
                "Amplitude",
                "Wavelength",
                "Frequency",
                "Phase",
                "Time"
            ],
            purpose:
                "Shows how waves propagate through space in three dimensions."
        },

        "young-double-slit.html": {
            name: "Young's Double-Slit Experiment",
            category: "Optics / Interference",
            controls: [
                "Wavelength",
                "Slit separation",
                "Screen distance"
            ],
            purpose:
                "Shows interference of coherent light waves and the formation of bright and dark fringes."
        },

        "simple-harmonic-motion.html": {
            name: "Simple Harmonic Motion",
            category: "Mechanics",
            controls: [
                "Simulation-dependent controls"
            ],
            purpose:
                "Shows oscillatory motion using an interactive 3D spring-mass system and helps visualize displacement, velocity and acceleration."
        }

    };

    const currentSimulation =
        simulations[page] || null;

    /* =========================
       WEBSITE CONTEXT
    ========================= */

    const siteContext = {
        siteName: "IDEA LAB",

        description:
            "IDEA LAB is an interactive physics laboratory where users explore physics through visual simulations and experiments.",

        simulations: simulations,

        currentSimulation:
            currentSimulation,

        rules: [
            "Answer physics questions clearly and accurately.",
            "Use the current simulation context when relevant.",
            "Do not claim controls or features that are not listed.",
            "Do not invent simulations.",
            "When explaining the current simulation, keep the explanation connected to what the user can actually see."
        ]
    };

    /* =========================
       CREATE ASSISTANT UI
    ========================= */

    const float = document.createElement("div");

    float.className =
        "idea-assistant-float";

    float.innerHTML = `
        <div class="idea-assistant-hint">
            Ask me
        </div>

        <button
            class="idea-assistant-robot"
            id="ideaAssistantRobot"
            type="button"
            aria-label="Open IDEA LAB Assistant"
        >
            <span class="idea-robot-face">
                <span class="idea-robot-eye left"></span>
                <span class="idea-robot-eye right"></span>
                <span class="idea-robot-mouth"></span>
            </span>

            <span class="idea-robot-antenna"></span>
            <span class="idea-robot-antenna-dot"></span>
        </button>
    `;

    const panel =
        document.createElement("div");

    panel.className =
        "idea-assistant-panel";

    panel.innerHTML = `
        <div class="idea-assistant-header">

            <div class="idea-assistant-identity">

                <div class="idea-assistant-avatar">
                    ✦
                </div>

                <div>

                    <div class="idea-assistant-title">
                        IDEA LAB Assistant
                    </div>

                    <div class="idea-assistant-subtitle">
                        Physics & Website Guide
                    </div>

                    <div
                        class="idea-assistant-status"
                        id="ideaAssistantStatus"
                    >
                        ● Online
                    </div>

                </div>

            </div>

        </div>

        <div
            class="idea-assistant-messages"
            id="ideaAssistantMessages"
        >

            <div class="idea-chat-message bot">

                <div class="idea-chat-bubble">
                    ${
                        currentSimulation
                        ? `You're exploring <strong>${currentSimulation.name}</strong>. Ask me anything about this experiment or the physics behind it.`
                        : `Hi! I'm the IDEA LAB Assistant. Ask me about physics or IDEA LAB.`
                    }
                </div>

            </div>

        </div>

        <div
            class="idea-assistant-quick"
        >

            <button
                type="button"
                data-prompt="Explain this simulation in simple words."
            >
                Explain this
            </button>

            <button
                type="button"
                data-prompt="What should I observe in this simulation?"
            >
                What to observe
            </button>

            <button
                type="button"
                data-prompt="Explain the physics behind this simulation."
            >
                Physics behind it
            </button>

        </div>

        <div class="idea-assistant-input">

            <input
                id="ideaAssistantInput"
                type="text"
                placeholder="Ask something..."
                autocomplete="off"
            >

            <button
                id="ideaAssistantSend"
                type="button"
            >
                Send
            </button>

        </div>
    `;

    document.body.appendChild(float);
    document.body.appendChild(panel);

    const robot =
        document.getElementById(
            "ideaAssistantRobot"
        );

    const input =
        document.getElementById(
            "ideaAssistantInput"
        );

    const sendButton =
        document.getElementById(
            "ideaAssistantSend"
        );

    const messages =
        document.getElementById(
            "ideaAssistantMessages"
        );

    const status =
        document.getElementById(
            "ideaAssistantStatus"
        );

    let history = [];

    /* =========================
       BASIC HTML FORMATTING
    ========================= */

    function escapeHTML(text) {

        return text
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    function formatMessage(text) {

        let html =
            escapeHTML(text);

        html = html.replace(
            /\*\*(.*?)\*\*/g,
            "<strong>$1</strong>"
        );

        html = html.replace(
            /^\s*[-*]\s+(.+)$/gm,
            "<li>$1</li>"
        );

        html = html.replace(
            /^\s*\d+\.\s+(.+)$/gm,
            "<li>$1</li>"
        );

        html = html.replace(
            /((?:<li>.*?<\/li>\s*)+)/gs,
            "<ul>$1</ul>"
        );

        html =
            html.replace(/\n/g, "<br>");

        return html;
    }

    function addMessage(
        text,
        sender
    ) {

        const wrapper =
            document.createElement("div");

        wrapper.className =
            "idea-chat-message " +
            sender;

        const bubble =
            document.createElement("div");

        bubble.className =
            "idea-chat-bubble";

        bubble.innerHTML =
            formatMessage(text);

        wrapper.appendChild(bubble);
        messages.appendChild(wrapper);

        messages.scrollTop =
            messages.scrollHeight;

        return bubble;
    }

    /* =========================
       OPEN / CLOSE
    ========================= */

    function toggleAssistant() {

        if (
            panel.style.display === "flex"
        ) {
            panel.style.display = "none";
            return;
        }

        panel.style.display = "flex";

        input.focus();
    }

    robot.addEventListener(
        "click",
        toggleAssistant
    );

    /* =========================
       QUICK PROMPTS
    ========================= */

    panel
        .querySelectorAll(
            ".idea-assistant-quick button"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                function () {

                    input.value =
                        this.dataset.prompt;

                    askAssistant();

                }
            );

        });

    /* =========================
       ASK ASSISTANT
    ========================= */

    async function askAssistant() {

        const question =
            input.value.trim();

        if (!question) return;

        input.disabled = true;
        sendButton.disabled = true;

        status.textContent =
            "● Thinking...";

        addMessage(
            question,
            "user"
        );

        input.value = "";

        history.push({
            role: "user",
            content: question
        });

        const botBubble =
            addMessage(
                "",
                "bot"
            );

        botBubble.innerHTML = `
            <span class="idea-thinking-dots">
                <span></span>
                <span></span>
                <span></span>
            </span>
        `;

        robot.classList.add(
            "idea-assistant-thinking"
        );

        try {

            const response =
                await fetch(
                    WORKER_URL,
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify({

                                message:
                                    question,

                                history:
                                    history,

                                site:
                                    "IDEA LAB",

                                siteContext:
                                    siteContext,

                                currentSimulation:
                                    currentSimulation

                            })
                    }
                );

            if (!response.ok) {

                throw new Error(
                    "AI request failed with status " +
                    response.status
                );

            }

            if (!response.body) {

                throw new Error(
                    "Streaming response is unavailable."
                );

            }

            const reader =
                response.body.getReader();

            const decoder =
                new TextDecoder();

            let buffer = "";
            let answer = "";

            botBubble.textContent = "";

            while (true) {

                const {
                    value,
                    done
                } = await reader.read();

                if (done) break;

                buffer +=
                    decoder.decode(
                        value,
                        {
                            stream: true
                        }
                    );

                const lines =
                    buffer.split("\n");

                buffer =
                    lines.pop() || "";

                for (const line of lines) {

                    const trimmed =
                        line.trim();

                    if (!trimmed) {
                        continue;
                    }

                    if (
                        !trimmed.startsWith(
                            "data:"
                        )
                    ) {
                        continue;
                    }

                    const dataText =
                        trimmed
                            .slice(5)
                            .trim();

                    if (
                        dataText === "[DONE]"
                    ) {
                        continue;
                    }

                    try {

                        const chunk =
                            JSON.parse(
                                dataText
                            );

                        let text = "";

                        if (
                            chunk.response &&
                            typeof chunk.response ===
                                "string"
                        ) {

                            text =
                                chunk.response;

                        } else if (
                            chunk.response &&
                            typeof chunk.response.text ===
                                "string"
                        ) {

                            text =
                                chunk.response.text;

                        } else if (
                            chunk.choices &&
                            chunk.choices[0] &&
                            chunk.choices[0].delta &&
                            typeof chunk
                                .choices[0]
                                .delta
                                .content ===
                                "string"
                        ) {

                            text =
                                chunk
                                    .choices[0]
                                    .delta
                                    .content;

                        }

                        if (text) {

                            answer += text;

                            botBubble.textContent =
                                answer;

                            messages.scrollTop =
                                messages.scrollHeight;
                        }

                    } catch (parseError) {

                        console.warn(
                            "IDEA LAB stream parse warning:",
                            parseError
                        );

                    }

                }

            }

            buffer +=
                decoder.decode();

            if (!answer.trim()) {

                throw new Error(
                    "The AI returned an empty response."
                );

            }

            botBubble.innerHTML =
                formatMessage(answer);

            history.push({
                role: "assistant",
                content: answer
            });

            status.textContent =
                "● Online";

        } catch (error) {

            console.error(
                "IDEA LAB Assistant error:",
                error
            );

            botBubble.innerHTML = `
                <div class="idea-assistant-error">

                    <div>
                        I'm having trouble connecting right now.
                    </div>

                    <button
                        type="button"
                        class="idea-assistant-retry"
                    >
                        Try again
                    </button>

                </div>
            `;

            const retryButton =
                botBubble.querySelector(
                    ".idea-assistant-retry"
                );

            retryButton.addEventListener(
                "click",
                function () {

                    input.value =
                        question;

                    botBubble.remove();

                    const last =
                        history[history.length - 1];

                    if (
                        last &&
                        last.role === "user" &&
                        last.content === question
                    ) {
                        history.pop();
                    }

                    askAssistant();

                }
            );

            status.textContent =
                "● Offline";

        } finally {

            input.disabled = false;
            sendButton.disabled = false;

            robot.classList.remove(
                "idea-assistant-thinking"
            );

            input.focus();

        }

    }

    sendButton.addEventListener(
        "click",
        askAssistant
    );

    input.addEventListener(
        "keydown",
        function (event) {

            if (event.key === "Enter") {
                askAssistant();
            }

        }
    );

    /* =========================
       DRAGGING
    ========================= */

    let dragging = false;
    let moved = false;

    let startX = 0;
    let startY = 0;

    let startLeft = 0;
    let startTop = 0;

    robot.addEventListener(
        "pointerdown",
        function (event) {

            event.preventDefault();

            dragging = true;
            moved = false;

            startX =
                event.clientX;

            startY =
                event.clientY;

            const rect =
                float.getBoundingClientRect();

            startLeft =
                rect.left;

            startTop =
                rect.top;

            float.style.right =
                "auto";

            float.style.bottom =
                "auto";

            float.style.left =
                startLeft + "px";

            float.style.top =
                startTop + "px";

            robot.classList.add(
                "dragging"
            );

            robot.setPointerCapture(
                event.pointerId
            );

        }
    );

    robot.addEventListener(
        "pointermove",
        function (event) {

            if (!dragging) {
                return;
            }

            const dx =
                event.clientX -
                startX;

            const dy =
                event.clientY -
                startY;

            if (
                Math.abs(dx) > 4 ||
                Math.abs(dy) > 4
            ) {
                moved = true;
            }

            const maxLeft =
                window.innerWidth -
                float.offsetWidth -
                8;

            const maxTop =
                window.innerHeight -
                float.offsetHeight -
                8;

            const newLeft =
                Math.max(
                    8,
                    Math.min(
                        startLeft + dx,
                        maxLeft
                    )
                );

            const newTop =
                Math.max(
                    8,
                    Math.min(
                        startTop + dy,
                        maxTop
                    )
                );

            float.style.left =
                newLeft + "px";

            float.style.top =
                newTop + "px";

        }
    );

    robot.addEventListener(
        "pointerup",
        function (event) {

            dragging = false;

            robot.classList.remove(
                "dragging"
            );

            if (moved) {

                event.preventDefault();

                robot.dataset.justDragged =
                    "true";

                setTimeout(
                    function () {

                        delete robot.dataset.justDragged;

                    },
                    120
                );

            }

        }
    );

})();
