/**
 * Sample study materials relevant to BTU Cottbus AI Master's program.
 * These simulate lecture notes that students can upload and query via RAG.
 */

export interface SampleDocument {
  title: string;
  content: string;
  category: string;
}

export const sampleDocuments: SampleDocument[] = [
  {
    title: "Deep Learning Fundamentals - Lecture Notes",
    category: "Deep Learning",
    content: `Deep learning is a subset of machine learning that uses neural networks with multiple layers (deep neural networks) to model and understand complex patterns. Unlike traditional machine learning algorithms, deep learning automatically learns feature hierarchies from data.

Neural Network Architecture: A neural network consists of an input layer, hidden layers, and an output layer. Each layer contains neurons that are connected to neurons in adjacent layers through weighted connections. The weights determine the strength of the signal passed between neurons.

Activation Functions are crucial for introducing non-linearity into the network. Common activation functions include: ReLU (Rectified Linear Unit): f(x) = max(0, x) - Most commonly used in hidden layers. Sigmoid: f(x) = 1 / (1 + e^(-x)) - Used for binary classification output. Tanh: f(x) = (e^x - e^(-x)) / (e^x + e^(-x)) - Used in LSTM networks. Softmax: Converts logits to probability distribution - Used for multi-class classification.

Backpropagation is the fundamental algorithm for training neural networks. It works by computing the gradient of the loss function with respect to each weight using the chain rule, then updating weights to minimize the loss.

Gradient Descent optimizers include SGD (Stochastic Gradient Descent), Momentum, Adam, and RMSprop. Adam (Adaptive Moment Estimation) is currently the most popular optimizer as it combines the benefits of Momentum and RMSprop.

Convolutional Neural Networks (CNNs) are specialized for processing grid-like data such as images. Key components include convolutional layers that apply filters to detect features, pooling layers that reduce dimensionality, and fully connected layers for classification.

Recurrent Neural Networks (RNNs) are designed for sequential data like text or time series. LSTMs (Long Short-Term Memory) and GRUs (Gated Recurrent Units) address the vanishing gradient problem in traditional RNNs.

Transfer Learning allows leveraging pre-trained models (like VGG, ResNet, BERT) for new tasks with limited data. This is particularly valuable when working with small datasets.

Regularization techniques include L1/L2 regularization, Dropout (randomly deactivating neurons during training), Batch Normalization, and Data Augmentation. These prevent overfitting and improve generalization.`
  },
  {
    title: "Natural Language Processing - Transformer Architecture",
    category: "NLP",
    content: `The Transformer architecture, introduced in the paper "Attention Is All You Need" by Vaswani et al. (2017), revolutionized natural language processing. Unlike RNNs, Transformers process all tokens in parallel using self-attention mechanisms.

Self-Attention Mechanism computes attention scores between every pair of positions in the input sequence. For each input token, we create Query (Q), Key (K), and Value (V) vectors. The attention score is computed as: Attention(Q,K,V) = softmax(QK^T / sqrt(d_k)) * V

Multi-Head Attention runs multiple attention operations in parallel, allowing the model to focus on different aspects of the input simultaneously. Each head learns different relationships between tokens.

Positional Encoding is necessary because Transformers process tokens in parallel and don't have inherent sequence order information. Sinusoidal positional encodings are added to the input embeddings.

The Encoder consists of multiple identical layers, each containing a multi-head self-attention sublayer and a feed-forward neural network. Layer normalization and residual connections are used around each sublayer.

The Decoder also has multiple layers, but includes masked self-attention (to prevent looking at future tokens) and cross-attention (to attend to encoder output).

BERT (Bidirectional Encoder Representations from Transformers) uses only the encoder part of the Transformer. It is pre-trained using Masked Language Model (MLM) and Next Sentence Prediction (NSP) objectives.

GPT (Generative Pre-trained Transformer) uses only the decoder part. It is pre-trained using autoregressive language modeling, predicting the next token given previous tokens.

Fine-tuning adapts pre-trained language models to specific downstream tasks by adding task-specific heads and training on smaller labeled datasets. This is much more efficient than training from scratch.

Prompt Engineering involves carefully designing input prompts to guide LLM behavior. Techniques include few-shot prompting (providing examples), chain-of-thought prompting (step-by-step reasoning), and instruction tuning.`
  },
  {
    title: "Generative AI and Large Language Models",
    category: "Generative AI",
    content: `Generative AI refers to artificial intelligence systems that can create new content including text, images, audio, video, and code. The recent advances in this field are driven by Large Language Models (LLMs) and diffusion models.

Large Language Models (LLMs) are neural networks with billions of parameters trained on massive text corpora. Key examples include GPT-4, Claude, Llama 2/3, and Mistral. These models exhibit emergent abilities like reasoning, translation, and code generation.

Retrieval-Augmented Generation (RAG) is a technique that combines retrieval from a knowledge base with text generation. The RAG workflow: User query is embedded, similar documents are retrieved from a vector database, retrieved context is combined with the query, and LLM generates an answer grounded in the retrieved information.

RAG addresses key LLM limitations: hallucinations (making up facts), outdated knowledge, and lack of domain-specific information. It is widely used in customer support, document analysis, and research assistance applications.

Vector Databases like ChromaDB, Pinecone, and Weaviate store embeddings (vector representations of text) and enable efficient similarity search. Documents are chunked, embedded, and indexed for quick retrieval.

Fine-tuning adapts a pre-trained LLM to specific domains or tasks using smaller datasets. Parameter-Efficient Fine-Tuning methods like LoRA (Low-Rank Adaptation) and QLoRA make fine-tuning more accessible by training only a small subset of parameters.

Prompt Engineering is the practice of designing effective prompts for LLMs. Key techniques include: zero-shot prompting, few-shot prompting, chain-of-thought prompting, and structured output formatting.

Agentic Workflows enable LLMs to use tools, interact with APIs, and perform multi-step tasks autonomously. Frameworks like LangChain and LangGraph support building such systems with memory, planning, and tool-use capabilities.

Evaluation of LLM outputs involves metrics like BLEU, ROUGE, and more recently LLM-as-a-judge approaches, where another LLM evaluates the quality of generated responses.

Ethical considerations in GenAI include bias in training data, hallucination risks, copyright concerns, and the environmental impact of training large models. Responsble AI practices are essential for deployment.`
  },
  {
    title: "Machine Learning Operations (MLOps)",
    category: "MLOps",
    content: `MLOps (Machine Learning Operations) is a set of practices that combines Machine Learning, DevOps, and Data Engineering to deploy and maintain ML systems in production. It aims to automate and streamline the ML lifecycle.

The ML Lifecycle includes: data collection and preprocessing, feature engineering, model training and validation, model deployment, monitoring, and retraining. Each stage requires careful orchestration and versioning.

Version Control for ML extends beyond code (Git) to include data versioning (DVC, LakeFS) and model versioning (MLflow Model Registry). Reproducibility is a key concern.

CI/CD for ML (MLOps pipelines) automates model training, testing, and deployment. Tools like GitHub Actions, GitLab CI, and Jenkins can trigger training pipelines when code or data changes.

Containerization using Docker packages ML models with all dependencies for consistent deployment across environments. Kubernetes orchestrates containerized ML services for scaling and management.

Model Serving frameworks include FastAPI (for Python-based REST APIs), TensorFlow Serving, TorchServe, and Triton Inference Server. These provide standardized interfaces for model inference.

Monitoring in production tracks model performance metrics (accuracy, latency, throughput), data drift (changes in input distribution), and concept drift (changes in the relationship between inputs and outputs).

Feature Stores (like Feast, Tecton) provide a centralized repository for feature engineering, ensuring consistency between training and serving. They handle feature computation, storage, and serving.

A/B Testing and Canary Deployments allow safe rollout of new models by comparing performance against existing versions before full deployment.

GDPR Compliance is particularly important for ML systems in Germany. Requirements include data minimization, right to explanation for automated decisions, and the ability to delete user data (right to be forgotten).`
  },
  {
    title: "Computer Vision - Advanced Topics",
    category: "Computer Vision",
    content: `Computer Vision enables machines to interpret and understand visual information from the world. Advanced topics include object detection, semantic segmentation, generative models, and 3D vision.

Convolutional Neural Networks (CNNs) form the backbone of modern CV systems. Key architectures: AlexNet (2012) pioneered deep CNNs, VGGNet showed depth matters, ResNet introduced skip connections enabling very deep networks.

Object Detection locates and classifies objects in images. Two main approaches: Two-stage detectors (Faster R-CNN, Mask R-CNN) first propose regions then classify them. One-stage detectors (YOLO, SSD) predict bounding boxes and classes directly in a single pass.

Semantic Segmentation assigns a class label to every pixel in an image. U-Net (with encoder-decoder architecture) is widely used for biomedical segmentation. DeepLab uses atrous convolutions for dense feature extraction.

Generative Models in CV include GANs (Generative Adversarial Networks), VAEs, and Diffusion Models. GANs pit a generator against a discriminator. Diffusion models (like Stable Diffusion, DALL-E) gradually denoise random noise to produce high-quality images.

Vision Transformers (ViT) apply the transformer architecture directly to image patches, treating them as token sequences. This has become the dominant approach, outperforming CNNs on many benchmarks.

Self-Supervised Learning methods like SimCLR, MoCo, and DINO learn visual representations without labeled data by creating pretext tasks such as contrastive learning.

Transfer Learning with pre-trained models like ResNet, EfficientNet, or ViT allows achieving good performance with limited labeled data. Models pre-trained on ImageNet can be fine-tuned for specialized tasks.

3D Vision involves understanding three-dimensional structure from images. Techniques include structure from motion, stereo vision, and neural radiance fields for novel view synthesis.

Edge AI deploys computer vision models on resource-constrained devices like smartphones and IoT cameras. Model compression techniques include quantization, pruning, and knowledge distillation.`
  },
  {
    title: "Reinforcement Learning and Decision Making",
    category: "Reinforcement Learning",
    content: `Reinforcement Learning (RL) is a framework where an agent learns to make decisions by interacting with an environment. The agent receives rewards or penalties for its actions and learns to maximize cumulative reward over time.

Key RL Concepts: The agent exists in states of the environment, takes actions that transition to new states, and receives rewards. The policy maps states to actions. The goal is to find the optimal policy that maximizes expected cumulative reward.

Markov Decision Processes (MDPs) formally define RL problems with states S, actions A, transition probabilities P(s'|s,a), rewards R(s,a), and discount factor gamma. The Bellman equation provides the foundation for value-based methods.

Value-Based Methods learn value functions: V(s) for state value or Q(s,a) for action value. Q-Learning is a classic off-policy algorithm. Deep Q-Networks (DQN) use neural networks to approximate Q-functions, with techniques like experience replay and target networks.

Policy Gradient Methods directly optimize the policy using gradient ascent. REINFORCE is a simple Monte Carlo policy gradient. Actor-Critic methods combine policy gradients with value function estimation for reduced variance.

Proximal Policy Optimization (PPO) is currently one of the most popular RL algorithms. It constrains policy updates using a clipped surrogate objective, making training more stable than vanilla policy gradients.

Model-Based RL learns a model of the environment dynamics and uses it for planning. This is more sample-efficient than model-free methods but requires accurate environment models.

Multi-Agent RL extends RL to settings with multiple interacting agents. Challenges include non-stationarity, credit assignment, and coordination.

Applications of RL include game playing (AlphaGo, OpenAI Five), robotics, autonomous driving, recommendation systems, and resource optimization.

Exploration vs Exploitation is a fundamental challenge. Methods include epsilon-greedy, Upper Confidence Bound (UCB), and Thompson sampling.`
  }
];
