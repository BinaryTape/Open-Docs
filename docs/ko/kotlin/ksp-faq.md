[//]: # (title: KSP FAQ)

### KSP를 사용하는 이유

KSP는 [kapt](kapt.md)에 비해 여러 가지 장점을 가집니다.
* 더 빠릅니다.
* Kotlin 사용자에게 더 유연한(fluent) API를 제공합니다.
* 생성된 Kotlin 소스에 대한 [다중 라운드 처리](ksp-multi-round.md)를 지원합니다.
* 멀티플랫폼 호환성을 염두에 두고 설계되었습니다.

### KSP는 왜 kapt보다 빠릅니까?

kapt는 Java 스텁을 생성하기 위해 모든 타입 참조를 파싱하고 해석해야 하지만, KSP는 필요할 때(on-demand) 참조를 해석합니다.
또한 `javac`에 위임하는 데에도 시간이 소요됩니다.

추가적으로, KSP의 [점진적(incremental) 처리 모델](ksp-incremental.md)은 단순히 격리하고 집계하는 것보다 더 세분화된 단위(finer granularity)를 가집니다. KSP는 모든 것을 재처리하는 것을 피할 수 있는 더 많은 기회를 찾습니다. 또한 KSP는 심볼 해석을 동적으로 추적하기 때문에, 한 파일의 변경이 다른 파일을 오염시킬(pollute) 가능성이 적으며, 따라서 재처리해야 하는 파일 집합이 더 작습니다. kapt는 `javac`에 처리를 위임하기 때문에 이는 불가능합니다.

### KSP는 Kotlin 전용입니까?

KSP는 Java 소스도 처리할 수 있습니다. API는 통합되어 있으며, 이는 Java 클래스와 Kotlin 클래스를 파싱할 때 KSP에서 통합된 데이터 구조를 얻는다는 의미입니다.

### KSP를 업그레이드하는 방법

KSP는 API와 구현체(implementation)를 가집니다. API는 거의 변경되지 않으며 하위 호환됩니다. 새로운 인터페이스가 추가될 수 있지만, 기존 인터페이스는 변경되지 않습니다. 구현체는 특정 컴파일러 버전에 종속됩니다. 새 릴리스에서는 지원되는 컴파일러 버전이 변경될 수 있습니다.

프로세서는 API에만 의존하므로 컴파일러 버전에 종속되지 않습니다.
그러나 프로세서 사용자는 프로젝트의 컴파일러 버전을 올릴 때 KSP 버전도 올려야 합니다.
그렇지 않으면 다음과 같은 오류가 발생합니다:

```text
ksp-a.b.c is too old for kotlin-x.y.z. Please upgrade ksp or downgrade kotlin-gradle-plugin
```

> 프로세서 사용자는 프로세서가 API에만 의존하므로 프로세서 버전을 올릴 필요가 없습니다.
>
{style="note"}

예를 들어, 특정 프로세서가 KSP 1.0.1 (Kotlin 1.6.0에 엄격하게 종속됨)과 함께 릴리스 및 테스트되었다고 가정해 봅시다.
이를 Kotlin 1.6.20에서 작동시키려면, Kotlin 1.6.20용으로 빌드된 KSP 버전(예: KSP 1.1.0)으로 KSP를 올리기만 하면 됩니다.

### 최신 KSP 구현체를 이전 Kotlin 컴파일러와 함께 사용할 수 있습니까?

언어 버전이 동일하다면, Kotlin 컴파일러는 하위 호환되어야 합니다.
Kotlin 컴파일러를 올리는 것은 대부분의 경우 사소한 일입니다. 최신 KSP 구현체가 필요하다면, 그에 따라 Kotlin 컴파일러를 업그레이드하십시오.

### KSP는 얼마나 자주 업데이트됩니까?

KSP는 [시맨틱 버전 관리(Semantic Versioning)](https://semver.org/)를 최대한 따르려고 노력합니다.
KSP 버전 `major.minor.patch`에서,
* `major`는 호환되지 않는 API 변경을 위해 예약되어 있습니다. 이에 대한 사전 결정된 일정은 없습니다.
* `minor`는 새로운 기능을 위해 예약되어 있습니다. 약 분기별로 업데이트될 예정입니다.
* `patch`는 버그 수정 및 새로운 Kotlin 릴리스를 위해 예약되어 있습니다. 대략 매월 업데이트됩니다.

일반적으로 새로운 Kotlin 버전이 릴리스된 후 며칠 내에 해당 KSP 릴리스가 제공되며, 여기에는 [사전 릴리스(베타 또는 RC)](eap.md)도 포함됩니다.

### Kotlin 외에 라이브러리에 대한 다른 버전 요구 사항이 있습니까?

다음은 라이브러리/인프라에 대한 요구 사항 목록입니다:
* Android Gradle Plugin 7.1.3+
* Gradle 6.8.3+

### KSP의 향후 로드맵은 무엇입니까?

다음 항목들이 계획되어 있습니다:
* [새로운 Kotlin 컴파일러](roadmap.md) 지원
* 멀티플랫폼 지원 개선. 예를 들어, 일부 타겟에서 KSP 실행/타겟 간의 계산 공유.
* 성능 향상. 해야 할 최적화 작업이 많이 있습니다!
* 버그 계속 수정.

아이디어를 논의하고 싶으시면 [#ksp channel in Kotlin Slack](https://kotlinlang.slack.com/archives/C013BA8EQSE) ([초대받기](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up))로 언제든지 연락 주십시오. [GitHub 이슈/기능 요청](https://github.com/google/ksp/issues)을 제출하거나 풀 리퀘스트를 보내는 것도 환영합니다!