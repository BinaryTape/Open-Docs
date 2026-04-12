# Koog를 사용하는 이유

Koog는 JetBrains 수준의 품질로 실제 문제를 해결하기 위해 설계되었습니다.
기본적인 프레임워크를 뛰어넘어 고급 AI 알고리즘, 즉시 사용 가능한(out-of-the-box) 검증된 기술, Kotlin DSL 및 Java fluent API, 그리고 강력한 멀티플랫폼 지원을 제공합니다.

Koog의 주된 핵심은 신뢰성입니다. 즉, 까다로운 엔터프라이즈 환경에서 자신 있게 사용할 수 있는 AI 에이전트를 구현할 수 있게 해줍니다.

## JVM 및 Kotlin 애플리케이션과의 통합

Koog는 Kotlin 개발자를 위해 특별히 설계된 Kotlin 도메인 특화 언어(DSL)와 함께 Java 사용자를 위한 fluent Java API를 제공합니다.
동일한 프레임워크가 두 JVM 언어 모두에서 네이티브한 느낌을 제공하므로, Kotlin 및 Java 기반 애플리케이션에 원활하게 통합되는 동시에 생산성을 크게 향상시키고 전반적인 개발자 경험을 개선합니다.

## JetBrains 제품을 통한 실무 검증

Koog는 내부 AI 에이전트를 포함한 여러 JetBrains 제품의 기반이 됩니다.
이러한 실무 통합을 통해 Koog는 실제 사용 사례에 대해 지속적으로 테스트되고 개선되며 검증됩니다.
Koog는 광범위한 피드백과 실제 제품 시나리오에서 얻은 통찰력을 바탕으로 실무에서 효과적인 기능에 집중합니다.
이러한 통합은 Koog를 다른 프레임워크와 차별화하는 강점을 제공합니다.

## 즉시 사용 가능한 고급 솔루션

Koog에는 에이전트 시스템(agentic systems) 개발을 단순화하고 가속화하기 위해 사전 구축된 조합 가능한 솔루션이 포함되어 있으며, 이는 기본 컴포넌트만 제공하는 프레임워크와 차별화되는 점입니다:

* **도메인 모델링을 통한 그래프 워크플로우.** 검증된 도메인 모델을 기반으로 구축된 명시적 그래프로 AI 워크플로우를 모델링합니다. 단순한 프롬프팅(naive prompting)에 의존하는 대신 구조화된 데이터 클래스로 요구 사항을 표현함으로써, 에이전트 동작을 정밀하게 제어하고 신뢰성과 예측 가능성을 크게 향상시킬 수 있습니다.
* **다양한 히스토리 압축 전략.** Koog는 장기 대화를 압축하고 관리하기 위한 고급 전략을 기본으로 제공하므로, 접근 방식을 수동으로 실험할 필요가 없습니다. ML 엔지니어가 테스트하고 개선한 미세 조정된 프롬프트(fine-tuned prompts), 기술 및 알고리즘을 통해 성능 개선이 입증된 방법론을 신뢰할 수 있습니다. 압축 전략에 대한 자세한 내용은 [History compression](https://docs.koog.ai/history-compression/)을 참조하세요. Koog가 실제 시나리오에서 압축 및 컨텍스트 관리를 처리하는 방법을 살펴보려면 [이 기사](https://blog.jetbrains.com/ai/2025/07/when-tool-calling-becomes-an-addiction-debugging-llm-patterns-in-koog/)를 확인해 보세요.
* **고급 퍼시스턴스(지속 가능한 실행, Durable execution).** Koog는 단순한 채팅 메시지가 아니라 에이전트 상태 머신 전체를 복구할 수 있게 해줍니다. 이를 통해 체크포인트, 장애 복구, 심지어 상태 머신 실행 중 어느 시점으로든 되돌리는 기능을 구현할 수 있습니다.
* **하나의 프레임워크에서 지원하는 모든 현대적 에이전트 패턴.** 그래프 워크플로우, GOAP(Goal-Oriented Action Planning, 목표 지향적 행동 계획) 및 LLM 플래닝, 멀티 에이전트 오케스트레이션(multi-agent orchestration)을 완전히 지원하며 자유롭게 조합할 수 있습니다. 사용 사례에 정확히 필요한 에이전트를 구축해 보세요.
* **원활한 LLM 전환.** 기존 대화 히스토리를 잃지 않고 언제든지 새로운 도구 세트를 가진 다른 거대 언어 모델(LLM)로 대화를 전환할 수 있습니다. Koog는 히스토리를 자동으로 다시 작성하고 사용 불가능한 도구를 처리하여 원활한 전환과 자연스러운 상호작용 흐름을 가능하게 합니다.
* **강력한 재시도 컴포넌트.** Koog에는 에이전트 시스템 내의 모든 작업 집합을 감싸고 구성 가능한 조건이 충족될 때까지 재시도할 수 있는 재시도 메커니즘이 포함되어 있습니다. 각 시도에 대해 피드백을 제공하고 조정하여 신뢰할 수 있는 결과를 보장할 수 있습니다. LLM 호출이 타임아웃되거나, 도구가 예상대로 작동하지 않거나, 네트워크 문제가 발생하는 경우에도 Koog는 에이전트가 탄력성을 유지하고 일시적인 오류 상황에서도 효과적으로 작동하도록 보장합니다. 더 자세한 기술적 내용은 [Retry functionality](https://docs.koog.ai/history-compression/)를 확인하세요.

## 광범위한 통합, 멀티플랫폼 지원, 향상된 관측성

Koog는 다양한 플랫폼과 환경에서 에이전트 애플리케이션의 개발 및 배포를 지원합니다:

* **Spring Boot, Spring AI 및 Ktor 통합**. Koog는 널리 사용되는 엔터프라이즈 환경과 통합됩니다.
    * Spring Boot의 경우, Koog는 즉시 사용 가능한 빈(bean)과 자동 구성된 LLM 클라이언트를 제공하여 AI 기반 워크플로우를 쉽게 구축할 수 있도록 돕습니다.
    * 이미 LLM 및 RAG 기능을 위해 Spring AI를 사용하고 있다면, Koog를 오케스트레이션 및 에이전트 프레임워크로서 그 위에 레이어로 추가할 수 있습니다. 이를 통해 Spring AI의 광범위한 통합 기능을 활용하는 동시에 Koog의 고급스럽고 신뢰할 수 있으며 비용 효율적인 AI 워크플로우의 이점을 누릴 수 있습니다.
    * Ktor 서버가 있는 경우 Koog를 플러그인으로 설치하고, 구성 파일을 사용하여 제공업체를 설정하며, LLM 클라이언트를 수동으로 연결하지 않고도 모든 루트(route)에서 직접 에이전트를 호출할 수 있습니다.
* **멀티플랫폼 지원**. JVM, JS, WasmJS, Android 및 iOS 타겟에 에이전트 애플리케이션을 배포할 수 있습니다.
* **광범위한 AI 통합**. Koog는 OpenAI, Anthropic, Google, DeepSeek, Mistral, Alibaba를 포함한 주요 LLM 제공업체는 물론 Bedrock과 같은 엔터프라이즈급 AI 클라우드와 통합됩니다. 또한 Ollama와 같은 로컬 모델도 지원합니다. 사용 가능한 제공업체의 전체 목록은 [LLM providers](https://docs.koog.ai/llm-providers/)를 참조하세요.
* **OpenTelemetry 지원**. Koog는 AI 애플리케이션의 모니터링 및 디버깅을 위해 [W&B Weave](https://wandb.ai/site/weave/), [Langfuse](https://langfuse.com/) 및 [DataDog](https://www.datadoghq.com/)와 같은 인기 있는 관측성(observability) 제공업체와 즉시 사용 가능한 통합을 제공합니다. 기본 OpenTelemetry 지원을 통해 시스템에서 이미 사용 중인 것과 동일한 도구를 사용하여 에이전트를 추적(trace), 로깅 및 측정할 수 있습니다. 자세한 내용은 [OpenTelemetry](https://docs.koog.ai/opentelemetry-support/)를 참조하세요.

## ML 엔지니어 및 제품 팀과의 협업

Koog의 고유한 장점은 JetBrains ML 엔지니어 및 제품 팀과의 직접적인 협업입니다.
이를 통해 Koog로 구축된 기능이 단순히 이론에 그치지 않고 실제 제품 요구 사항을 바탕으로 테스트되고 개선되도록 보장합니다.
이는 Koog가 다음을 포함하고 있음을 의미합니다:

* 실제 성능에 최적화된 **미세 조정된 프롬프트 및 전략**.
* 독특한 히스토리 압축 전략과 같이 제품 개발을 통해 발견되고 검증된 **입증된 엔지니어링 접근 방식**. 자세한 내용은 [이 상세 기사](https://blog.jetbrains.com/ai/2025/07/when-tool-calling-becomes-an-addiction-debugging-llm-patterns-in-koog/)에서 확인할 수 있습니다.
* Koog가 효율성을 유지하고 진화하는 요구 사항에 적응할 수 있도록 돕는 **지속적인 개선**.

## 개발자 커뮤니티에 대한 헌신

Koog 팀은 강력한 개발자 커뮤니티를 구축하는 데 깊이 전념하고 있습니다.
적극적으로 피드백을 수집하고 반영함으로써, Koog는 개발자의 요구를 효과적으로 충족하도록 진화하고 있습니다.
저희는 개발자에게 힘을 실어주기 위해 다양한 AI 아키텍처에 대한 지원, 포괄적인 벤치마크, 상세한 사용 사례 가이드 및 교육 리소스를 적극적으로 확장하고 있습니다.

## 시작하기

* [Overview](index.md)에서 Koog의 기능을 살펴보세요.
* [Quickstart](quickstart.md) 가이드를 통해 첫 번째 Koog 에이전트를 구축해 보세요.
* Koog [release notes](https://github.com/JetBrains/koog/blob/main/CHANGELOG.md)에서 최신 업데이트를 확인하세요.
* [Examples](https://docs.koog.ai/examples/)를 통해 배워보세요.