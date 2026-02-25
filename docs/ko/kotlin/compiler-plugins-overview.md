[//]: # (title: 컴파일러 플러그인)

<snippet id="compiler-plugin-description">
컴파일러 플러그인은 컴파일러 자체를 수정하지 않고도 코드가 컴파일되는 동안 컴파일 프로세스에 개입하여 코드를 분석하거나 변경합니다. 예를 들어, 코드를 어노테이션하거나 새로운 코드를 생성하여 다른 프레임워크나 API와 호환되도록 만들 수 있습니다.
</snippet>

이 페이지에서는 사용 가능한 Kotlin 컴파일러 플러그인과 요구 사항에 맞는 플러그인이 없는 경우 취할 수 있는 조치에 대해 설명합니다.

Kotlin 팀은 다음 컴파일러 플러그인들을 유지 관리합니다:

| 플러그인                                                                                         | 설명                                                                                                                               |
|------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------|
| [All-open](all-open-plugin.md)                                                                 | 어노테이션된 클래스와 그 멤버를 자동으로 `open`으로 만들어 프레임워크가 런타임에 이를 확장할 수 있게 합니다.                                  |
| [AtomicFU](https://github.com/Kotlin/kotlinx-atomicfu)                                         | 원자적 연산(atomic operations)을 락-프리(lock-free) 동시성을 위한 효율적인 플랫폼별 구현으로 변환합니다.                                 |
| [DataFrame](https://kotlin.github.io/dataframe/compiler-plugin.html)                           | 안전하고 Kotlin 친화적인 방식으로 [`DataFrame`](https://kotlin.github.io/dataframe/home.html)을 다룰 수 있는 타입 기반 API를 생성합니다. |
| [`jvm-abi-gen`](https://github.com/JetBrains/kotlin/tree/master/plugins/jvm-abi-gen)           | 애플리케이션 바이너리 인터페이스(ABI) JAR를 생성합니다.                                                                                        |
| [`js-plain-objects`](https://github.com/JetBrains/kotlin/tree/master/plugins/js-plain-objects) | Kotlin 클래스를 일반 JavaScript 객체(plain JavaScript objects)로 노출하여 JS 도구 및 라이브러리와의 상호운용성을 향상시킵니다.                                      |
| [kapt](kapt.md)                                                                                | Kotlin 코드에서 Java 어노테이션 프로세서를 실행하고 추가 소스 파일을 생성합니다.                                                     |
| [Lombok](lombok.md)                                                                            | Kotlin 코드가 Java 소스의 Lombok 어노테이션으로 생성된 코드를 이해하고 사용할 수 있도록 합니다.                                           |
| [`no-arg`](no-arg-plugin.md)                                                                   | 어노테이션된 클래스에 대해 인자가 없는 생성자(no-argument constructors)를 생성하여 이를 필요로 하는 프레임워크를 지원합니다.                                         |
| [Power-assert](power-assert.md)                                                                | 표현식의 각 부분에 대한 상세 값을 보여줌으로써 단언문(assertion) 실패 메시지를 개선합니다.                                                    |
| [SAM with receiver](sam-with-receiver-plugin.md)                                               | SAM 인터페이스가 수신 객체가 있는 람다(lambdas with receivers)를 사용하여 더 DSL 같은 구문을 가질 수 있도록 허용합니다.                                                           |
| [Serialization](serialization.md)                                                              | 리플렉션 없이 Kotlin 객체를 직렬화 및 역직렬화하는 코드를 생성합니다.                                                        |

Google의 Android 팀은 다음을 유지 관리합니다:

| 플러그인                                                                                      | 설명                                                                                                       |
|---------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------|
| [Compose compiler Gradle plugin](https://developer.android.com/develop/ui/compose/compiler) | Compose 컴파일러를 Gradle과 통합하여 선언형 UI 기능과 Compose 전용 최적화를 활성화합니다. |
| [Parcelize plugin](https://plugins.gradle.org/plugin/org.jetbrains.kotlin.plugin.parcelize) | `Parcelable` 구현을 자동으로 생성하여 Android 컴포넌트 간에 Kotlin 객체를 전달할 수 있게 합니다.   |

이러한 플러그인이 지원하지 않는 방식으로 컴파일 프로세스를 조정해야 하는 경우, 먼저 [Kotlin Symbol Processing (KSP) API](https://kotlinlang.org/docs/ksp-overview.html)를 사용할 수 있는지 또는 [Android lint](https://developer.android.com/studio/write/lint)와 같은 외부 린터를 사용할 수 있는지 확인하세요. [Kotlin Slack](https://slack-chats.kotlinlang.org/c/compiler)을 둘러보거나 [문의하여](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up) 사용 사례에 대한 조언을 구할 수도 있습니다.

여전히 필요한 기능을 찾을 수 없다면, [커스텀 컴파일러 플러그인을 생성](custom-compiler-plugins.md)할 수 있습니다. Kotlin 컴파일러 플러그인 API는 **불안정(unstable)**하므로 이 방법은 최후의 수단으로만 사용하세요. 커스텀 컴파일러 플러그인을 만들 경우, 새로운 컴파일러 릴리스마다 하위 호환성이 깨지는 변경 사항(breaking changes)이 도입되므로 이를 유지 관리하기 위해 상당한 노력을 지속적으로 투자해야 합니다.