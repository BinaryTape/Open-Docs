[//]: # (title: KSP FAQ)

### 왜 KSP인가요?

KSP는 [kapt](kapt.md) 대비 다음과 같은 몇 가지 장점이 있습니다:
* 더 빠릅니다.
* Kotlin 사용자에게 더 유연한(fluent) API를 제공합니다.
* 생성된 Kotlin 소스에 대해 [다중 라운드 처리(multiple round processing)](ksp-multi-round.md)를 지원합니다.
* 멀티플랫폼 호환성을 염두에 두고 설계되었습니다.

### 왜 KSP가 kapt보다 더 빠른가요?

kapt는 Java 스텁(stub)을 생성하기 위해 모든 타입 참조를 파싱하고 해석(resolve)해야 하는 반면, KSP는 참조를 온디맨드(on-demand) 방식으로 해석합니다.
또한 javac에 위임하는 과정에서도 시간이 소요됩니다.

그뿐만 아니라 KSP의 [증분 처리 모델(incremental processing model)](ksp-incremental.md)은 단순한 격리(isolating) 및 집계(aggregating)보다 더 세밀한(finer granularity) 단위를 가집니다. 이를 통해 모든 것을 다시 처리하는 상황을 피할 수 있는 더 많은 기회를 찾아냅니다. 또한 KSP는 심볼 해석을 동적으로 추적하기 때문에, 파일의 변경 사항이 다른 파일을 오염시킬 가능성이 적으며, 따라서 재처리해야 할 파일 집합이 더 작아집니다. 이는 처리를 javac에 위임하는 kapt에서는 불가능한 방식입니다.

### KSP는 Kotlin 전용인가요?

KSP는 Java 소스도 처리할 수 있습니다. API가 통합되어 있어, Java 클래스와 Kotlin 클래스를 파싱할 때 KSP 내에서 통합된 데이터 구조를 얻게 됩니다.

### KSP를 업그레이드하려면 어떻게 해야 하나요?

KSP는 API와 구현체(implementation)로 나뉩니다. API는 거의 변경되지 않으며 하위 호환성을 유지합니다. 새로운 인터페이스가 추가될 수는 있지만, 기존 인터페이스는 변경되지 않습니다. 구현체는 특정 컴파일러 버전에 종속됩니다. 새로운 릴리스와 함께 지원되는 컴파일러 버전이 변경될 수 있습니다.

프로세서(Processor)는 API에만 의존하므로 컴파일러 버전에 종속되지 않습니다. 하지만 프로세서 사용자는 프로젝트의 컴파일러 버전을 올릴 때 KSP 버전도 함께 올려야 합니다. 그렇지 않으면 다음과 같은 오류가 발생합니다:

```text
ksp-a.b.c is too old for kotlin-x.y.z. Please upgrade ksp or downgrade kotlin-gradle-plugin
```

> 프로세서는 API에만 의존하기 때문에, 프로세서 사용자는 프로세서의 버전을 올릴 필요가 없습니다.
>
{style="note"}

예를 들어, 어떤 프로세서가 Kotlin 1.6.0에 엄격하게 의존하는 KSP 1.0.1로 릴리스되고 테스트되었다고 가정해 보겠습니다. 이 프로세서를 Kotlin 1.6.20에서 작동하게 하려면, Kotlin 1.6.20용으로 빌드된 KSP 버전(예: KSP 1.1.0)으로 올리기만 하면 됩니다.

### 최신 KSP 구현체를 이전 버전의 Kotlin 컴파일러와 함께 사용할 수 있나요?

언어 버전이 같다면 Kotlin 컴파일러는 하위 호환성을 유지해야 합니다. 대부분의 경우 Kotlin 컴파일러 버전을 올리는 것은 간단합니다. 더 최신의 KSP 구현체가 필요한 경우, 그에 맞춰 Kotlin 컴파일러를 업그레이드해 주세요.

### KSP는 얼마나 자주 업데이트되나요?

KSP는 [시맨틱 버저닝(Semantic Versioning)](https://semver.org/)을 최대한 준수하려고 노력합니다.
KSP 버전이 `major.minor.patch`일 때:
* `major`는 호환되지 않는 API 변경을 위해 예약되어 있습니다. 이에 대한 미리 정해진 일정은 없습니다.
* `minor`는 새로운 기능을 위해 예약되어 있습니다. 대략 분기별로 업데이트될 예정입니다.
* `patch`는 버그 수정 및 새로운 Kotlin 릴리스를 위해 예약되어 있습니다. 대략 매월 업데이트됩니다.

일반적으로 [프리릴리스(Beta 또는 RC)](eap.md)를 포함하여 새로운 Kotlin 버전이 출시된 후 며칠 이내에 해당 KSP 릴리스가 제공됩니다.

### Kotlin 외에 라이브러리에 대한 다른 버전 요구 사항이 있나요?

라이브러리 및 인프라에 대한 요구 사항 목록은 다음과 같습니다:
* Android Gradle 플러그인 7.1.3+
* Gradle 6.8.3+

### KSP의 향후 로드맵은 무엇인가요?

다음과 같은 항목들이 계획되어 있습니다:
* [새로운 Kotlin 컴파일러](roadmap.md) 지원
* 멀티플랫폼 지원 개선. 예를 들어, 타겟의 일부에서만 KSP를 실행하거나 타겟 간에 계산 결과를 공유하는 방식입니다.
* 성능 개선. 수행해야 할 최적화 작업들이 많이 남아 있습니다!
* 지속적인 버그 수정.

아이디어를 논의하고 싶다면 언제든지 [Kotlin Slack의 #ksp 채널](https://kotlinlang.slack.com/archives/C013BA8EQSE)([초대 받기](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up))을 통해 문의해 주세요. [GitHub 이슈/기능 요청(feature requests)](https://github.com/google/ksp/issues) 또는 풀 리퀘스트(pull request)를 보내주시는 것도 환영합니다!