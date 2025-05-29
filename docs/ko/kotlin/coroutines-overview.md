[//]: # (title: 코루틴)

비동기 또는 논블로킹(non-blocking) 프로그래밍은 개발 환경에서 중요한 부분입니다. 서버, 데스크톱 또는 모바일 애플리케이션을 개발할 때, 사용자 관점에서 유연할 뿐만 아니라 필요에 따라 확장 가능한 경험을 제공하는 것이 중요합니다.

코틀린은 언어 수준에서 [코루틴](https://en.wikipedia.org/wiki/Coroutine) 지원을 제공하고 대부분의 기능을 라이브러리에 위임함으로써 이 문제를 유연한 방식으로 해결합니다.

코루틴은 비동기 프로그래밍의 가능성을 열어줄 뿐만 아니라, 동시성과 액터(actor)와 같은 풍부한 다른 가능성도 제공합니다.

## 시작하기

코틀린이 처음이신가요? [시작하기](getting-started.md) 페이지를 살펴보세요.

### 문서

- [코루틴 가이드](coroutines-guide.md)
- [기본](coroutines-basics.md)
- [채널](channels.md)
- [코루틴 컨텍스트 및 디스패처](coroutine-context-and-dispatchers.md)
- [공유 가변 상태 및 동시성](shared-mutable-state-and-concurrency.md)
- [비동기 플로우](flow.md)

### 튜토리얼

- [비동기 프로그래밍 기법](async-programming.md)
- [코루틴 및 채널 소개](coroutines-and-channels.md)
- [IntelliJ IDEA를 사용하여 코루틴 디버그](debug-coroutines-with-idea.md)
- [IntelliJ IDEA를 사용하여 Kotlin Flow 디버그 – 튜토리얼](debug-flow-with-idea.md)
- [Android에서 Kotlin 코루틴 테스트하기](https://developer.android.com/kotlin/coroutines/test)

## 샘플 프로젝트

- [kotlinx.coroutines 예시 및 소스](https://github.com/Kotlin/kotlin-coroutines/tree/master/examples)
- [KotlinConf 앱](https://github.com/JetBrains/kotlinconf-app)