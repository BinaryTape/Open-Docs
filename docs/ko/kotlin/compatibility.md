<!--- TOC -->

* [호환성](#호환성)
* [공개 API 유형](#공개-api-유형)
  * [실험적 API](#실험적-api)
  * [Flow 프리뷰 API](#flow-프리뷰-api)
  * [구식 API](#구식-api)
  * [내부 API](#내부-api)
  * [안정화된 API](#안정화된-api)
  * [지원 중단 주기](#지원-중단-주기)
* [어노테이션이 적용된 API 사용하기](#어노테이션이-적용된-api-사용하기)
  * [프로그래밍 방식으로](#프로그래밍-방식으로)
  * [Gradle](#gradle)
  * [Maven](#maven)

<!--- END -->

## 호환성
이 문서는 `kotlinx.coroutines` 라이브러리의 1.0.0 버전부터 적용되는 호환성 정책과 호환성 관련 어노테이션(주석)의 의미를 설명합니다.

## 공개 API 유형
`kotlinx.coroutines` 공개 API는 안정화된(stable), 실험적(experimental), 구식(obsolete), 내부(internal), 지원 중단(deprecated)의 다섯 가지 유형으로 제공됩니다. 안정화된 API를 제외한 모든 공개 API는 해당 어노테이션으로 표시됩니다.

### 실험적 API
실험적 API는 [`@ExperimentalCoroutinesApi`][ExperimentalCoroutinesApi] 어노테이션으로 표시됩니다. API는 설계에 잠재적인 미해결 질문이 있어, 궁극적으로 API의 의미론(semantics) 변경이나 지원 중단으로 이어질 수 있는 경우 실험적으로 표시됩니다.

기본적으로 대부분의 새로운 API는 실험적으로 표시되며, 새로운 문제가 발생하지 않으면 다음 주요 릴리스 중 하나에서 안정화됩니다. 그렇지 않으면, ABI(Application Binary Interface) 변경 없이 의미론이 수정되거나 API는 지원 중단 주기를 거치게 됩니다.

실험적 API를 사용할 때 위험할 수 있는 경우:
*   `kotlinx.coroutines`에 의존하는 라이브러리를 작성 중이며, 안정화된 라이브러리 API에서 실험적 코루틴 API를 사용하려는 경우.
    이는 라이브러리 최종 사용자가 `kotlinx.coroutines` 버전을 업데이트할 때, 실험적 API의 의미론이 약간 달라져 원치 않는 결과를 초래할 수 있습니다.
*   실험적 API를 중심으로 애플리케이션의 핵심 인프라를 구축하려는 경우.

### Flow 프리뷰 API
모든 [Flow] 관련 API는 [`@FlowPreview`][FlowPreview] 어노테이션으로 표시됩니다. 이 어노테이션은 Flow API가 프리뷰(preview) 상태임을 나타냅니다. 저희는 프리뷰 기능에 대해 릴리스 간 호환성을 보장하지 않으며, 여기에는 바이너리, 소스 및 의미론 호환성이 포함됩니다.

프리뷰 API를 사용할 때 위험할 수 있는 경우:
*   라이브러리/프레임워크를 작성 중이며, 안정화된 릴리스 또는 안정화된 API에서 [Flow] API를 사용하려는 경우.
*   애플리케이션의 핵심 인프라에서 [Flow]를 사용하려는 경우.
*   [Flow]를 "한 번 작성하고 잊는" 솔루션으로 사용하고 싶지만, `kotlinx.coroutines` 업데이트 시 추가 유지보수 비용을 감당할 수 없는 경우.

### 구식 API
구식 API는 [`@ObsoleteCoroutinesApi`][ObsoleteCoroutinesApi] 어노테이션으로 표시됩니다. 구식 API는 실험적 API와 유사하지만, 이미 심각한 설계 결함이 있는 것으로 알려져 있으며 잠재적인 대체품이 있지만 아직 구현되지 않았습니다.

이 API의 의미론은 변경되지 않지만, 대체품이 준비되는 즉시 지원 중단 주기를 거치게 됩니다.

### 내부 API
내부 API는 [`@InternalCoroutinesApi`][InternalCoroutinesApi] 어노테이션으로 표시되거나 `kotlinx.coroutines.internal` 패키지의 일부입니다. 이 API는 안정성이 보장되지 않으며, 향후 릴리스에서 변경되거나 제거될 수 있습니다. 내부 API 사용을 피할 수 없는 경우, [이슈 트래커](https://github.com/Kotlin/kotlinx.coroutines/issues/new)에 보고해 주십시오.

### 안정화된 API
안정화된 API는 ABI 및 문서화된 의미론을 보존하도록 보장됩니다. 만약 어떤 시점에 고칠 수 없는 설계 결함이 발견되더라도, 이 API는 지원 중단 주기를 거치며 가능한 한 오랫동안 바이너리 호환성을 유지할 것입니다.

### 지원 중단 주기
API가 지원 중단되면 여러 단계를 거치며, 각 단계 사이에는 최소 한 번의 주요 릴리스가 있습니다.
*   기능이 컴파일 경고와 함께 지원 중단됩니다. 대부분의 경우, IntelliJ IDEA의 도움을 받아 지원 중단된 사용법을 자동으로 마이그레이션할 수 있도록 적절한 대체(및 해당 `replaceWith` 선언)가 제공됩니다.
*   지원 중단 수준이 `error` 또는 `hidden`으로 상향됩니다. 더 이상 지원 중단된 API에 대해 새 코드를 컴파일할 수 없지만, 여전히 ABI에는 존재합니다.
*   API가 완전히 제거됩니다. 저희는 그렇게 하지 않기 위해 최선을 다하고 있으며 어떤 API도 제거할 계획은 없지만, 보안 취약점과 같은 예측 불가능한 문제가 발생할 경우를 대비하여 이 옵션을 남겨두고 있습니다.

## 어노테이션(주석)이 적용된 API 사용하기
모든 API 어노테이션은 [kotlin.Experimental](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-experimental/)입니다. 이는 실험적 또는 구식 API 사용에 대한 컴파일 경고를 생성하기 위해 수행됩니다. 경고는 특정 호출 사이트에 대해 프로그래밍 방식으로 비활성화하거나 전체 모듈에 대해 전역적으로 비활성화할 수 있습니다.

### 프로그래밍 방식으로
특정 호출 사이트의 경우, [OptIn](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-opt-in/) 어노테이션을 사용하여 경고를 비활성화할 수 있습니다:
```kotlin
@OptIn(ExperimentalCoroutinesApi::class) // 실험적 코루틴 API에 대한 경고 비활성화
fun experimentalApiUsage() {
    someKotlinxCoroutinesExperimentalMethod()
}
``` 

### Gradle
Gradle 프로젝트의 경우, `build.gradle` 파일에 컴파일러 플래그를 전달하여 경고를 비활성화할 수 있습니다:

```groovy
tasks.withType(org.jetbrains.kotlin.gradle.tasks.AbstractKotlinCompile).all {
    kotlinOptions.freeCompilerArgs += ["-Xuse-experimental=kotlinx.coroutines.ExperimentalCoroutinesApi"]
}

```

### Maven
Maven 프로젝트의 경우, `pom.xml` 파일에 컴파일러 플래그를 전달하여 경고를 비활성화할 수 있습니다:
```xml
<plugin>
    <artifactId>kotlin-maven-plugin</artifactId>
    <groupId>org.jetbrains.kotlin</groupId>
    ... your configuration ...
    <configuration>
        <args>
            <arg>-Xuse-experimental=kotlinx.coroutines.ExperimentalCoroutinesApi</arg>
        </args>
    </configuration>
</plugin>
```

<!--- MODULE kotlinx-coroutines-core -->
<!--- INDEX kotlinx.coroutines.flow -->

[Flow]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/-flow/index.html

<!--- INDEX kotlinx.coroutines -->

[ExperimentalCoroutinesApi]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-experimental-coroutines-api/index.html
[FlowPreview]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-flow-preview/index.html
[ObsoleteCoroutinesApi]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-obsolete-coroutines-api/index.html
[InternalCoroutinesApi]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-internal-coroutines-api/index.html

<!--- END -->