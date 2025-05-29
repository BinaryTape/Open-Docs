[//]: # (title: AI 기반 앱 개발을 위한 Kotlin)

Kotlin은 AI 기반 애플리케이션을 구축하기 위한 현대적이고 실용적인 기반을 제공합니다. Kotlin은 다양한 플랫폼에서 사용될 수 있으며, 기존 AI 프레임워크와 잘 통합되고, 일반적인 AI 개발 패턴을 지원합니다.

> 이 페이지에서는 [Kotlin-AI-Examples](https://github.com/Kotlin/Kotlin-AI-Examples) 저장소의 실용적인 예제를 통해 실제 AI 시나리오에서 Kotlin이 어떻게 사용되는지 소개합니다.
> 
{style="note"}

## Kotlin AI 에이전트 프레임워크 – Koog

[Koog](https://koog.ai)는 외부 서비스 없이 로컬에서 AI 에이전트를 생성하고 실행하는 데 사용되는 Kotlin 기반 프레임워크입니다. Koog는 JetBrains의 혁신적인 오픈 소스 에이전트 프레임워크로, 개발자가 JVM 생태계 내에서 AI 에이전트를 구축할 수 있도록 지원합니다. 이 프레임워크는 도구와 상호 작용하고, 복잡한 워크플로를 처리하며, 사용자와 통신할 수 있는 지능형 에이전트를 구축하기 위한 순수 Kotlin 구현을 제공합니다.

## 더 많은 사용 사례

Kotlin이 AI 개발에 도움을 줄 수 있는 다양한 다른 사용 사례가 있습니다. 언어 모델을 백엔드 서비스에 통합하는 것부터 AI 기반 사용자 인터페이스를 구축하는 것까지, 이러한 예제들은 다양한 AI 애플리케이션에서 Kotlin의 다양성을 보여줍니다.

### 검색 증강 생성 

Kotlin을 사용하여 언어 모델을 문서, 벡터 저장소 또는 API와 같은 외부 소스에 연결하는 검색 증강 생성(RAG) 파이프라인을 구축하세요.
예시:

* [`springAI-demo`](https://github.com/Kotlin/Kotlin-AI-Examples/tree/master/projects/spring-ai/springAI-demo): Kotlin 표준 라이브러리 문서를 벡터 저장소에 로드하고 문서 기반 Q&A를 지원하는 Spring Boot 앱.
* [`langchain4j-spring-boot`](https://github.com/Kotlin/Kotlin-AI-Examples/tree/master/projects/langchain4j/langchain4j-spring-boot): LangChain4j를 사용한 최소한의 RAG 예제.

### 에이전트 기반 애플리케이션

언어 모델과 도구를 사용하여 추론하고, 계획하며, 행동하는 AI 에이전트를 Kotlin으로 구축하세요.
예시:

* [`koog`](https://github.com/JetBrains/koog): Kotlin 에이전트 프레임워크 Koog를 사용하여 AI 에이전트를 구축하는 방법을 보여줍니다.
* [`langchain4j-spring-boot`](https://github.com/Kotlin/Kotlin-AI-Examples/tree/master/projects/langchain4j/langchain4j-spring-boot): LangChain4j로 구축된 간단한 도구 사용 에이전트가 포함되어 있습니다.

### 사고의 사슬 프롬프팅

언어 모델이 다단계 추론을 수행하도록 안내하는 구조화된 프롬프팅 기법을 구현하세요.
예시:

* [`LangChain4j_Overview.ipynb`](https://github.com/Kotlin/Kotlin-AI-Examples/blob/master/notebooks/langchain4j/LangChain4j_Overview.ipynb): 사고의 사슬과 구조화된 출력을 시연하는 Kotlin 노트북.

### 백엔드 서비스의 LLM

Kotlin과 Spring을 사용하여 LLM을 비즈니스 로직이나 REST API에 통합하세요.
예시:

* [`spring-ai-examples`](https://github.com/Kotlin/Kotlin-AI-Examples/tree/master/projects/spring-ai/spring-ai-examples): 분류, 채팅, 요약 예제가 포함되어 있습니다.
* [`springAI-demo`](https://github.com/Kotlin/Kotlin-AI-Examples/tree/master/projects/spring-ai/springAI-demo): LLM 응답과 애플리케이션 로직 간의 완전한 통합을 보여줍니다.

### AI를 활용한 멀티플랫폼 사용자 인터페이스

Compose Multiplatform를 사용하여 Kotlin으로 대화형 AI 기반 UI를 구축하세요.
예시:

* [`mcp-demo`](https://github.com/Kotlin/Kotlin-AI-Examples/tree/master/projects/mcp/mcp-demo): Claude 및 OpenAI에 연결하고 Compose Multiplatform를 사용하여 응답을 표시하는 데스크톱 UI.

## 예제 살펴보기

[Kotlin-AI-Examples](https://github.com/Kotlin/Kotlin-AI-Examples) 저장소에서 예제를 살펴보고 실행할 수 있습니다.
각 프로젝트는 독립적입니다. 각 프로젝트를 Kotlin 기반 AI 애플리케이션을 구축하는 데 참조 또는 템플릿으로 사용할 수 있습니다.

## 다음 단계

* IntelliJ IDEA에서 Kotlin과 함께 Spring AI를 사용하는 방법에 대해 자세히 알아보려면 [Qdrant에 저장된 문서를 기반으로 질문에 답변하기 위해 Spring AI를 사용하는 Kotlin 앱을 구축하는](spring-ai-guide.md) 튜토리얼을 완료하세요.
* [Kotlin 커뮤니티](https://kotlinlang.org/community/)에 참여하여 Kotlin으로 AI 애플리케이션을 구축하는 다른 개발자들과 소통하세요.