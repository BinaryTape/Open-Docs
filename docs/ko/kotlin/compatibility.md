<!--- TOC -->

* [호환성](#compatibility)
* [공개 API 유형](#public-api-types)
  * [실험적 API](#experimental-api)
  * [Flow 프리뷰 API](#flow-preview-api)
  * [구식 API](#obsolete-api)
  * [내부 API](#internal-api)
  * [안정적 API](#stable-api)
  * [사용 중단 주기](#deprecation-cycle)
* [어노테이션이 적용된 API 사용](#using-annotated-api)
  * [프로그래밍 방식으로](#programmatically)
  * [Gradle](#gradle)
  * [Maven](#maven)

<!--- END -->

## 호환성
이 문서는 `kotlinx.coroutines` 라이브러리의 1.0.0 버전 이후 호환성 정책과 호환성별 어노테이션의 의미에 대해 설명합니다.

## 공개 API 유형
`kotlinx.coroutines` 공개 API는 안정(stable), 실험(experimental), 구식(obsolete), 내부(internal), 사용 중단(deprecated)의 다섯 가지 유형으로 제공됩니다. 안정적인 API를 제외한 모든 공개 API는 해당 어노테이션으로 표시됩니다.

### 실험적 API
실험적 API는 [@ExperimentalCoroutinesApi][ExperimentalCoroutinesApi] 어노테이션으로 표시됩니다.
API는 설계에 잠재적인 미해결 질문이 있어 궁극적으로 API의 의미 변경 또는 사용 중단으로 이어질 수 있을 때 실험적으로 표시됩니다.

기본적으로 대부분의 새로운 API는 실험적으로 표시되며, 새로운 문제가 발생하지 않는다면 다음 주요 릴리스 중 하나에서 안정화됩니다.
그렇지 않은 경우, ABI 변경 없이 의미가 수정되거나 API는 사용 중단 주기를 거칩니다.

실험적 API를 사용하는 것이 위험할 수 있는 경우:
* `kotlinx.coroutines`에 의존하는 라이브러리를 작성 중이며 안정적인 라이브러리 API에서 실험적인 코루틴 API를 사용하려는 경우.
이는 라이브러리의 최종 사용자가 실험적인 API의 의미가 약간 달라진 `kotlinx.coroutines` 버전을 업데이트할 때 원치 않는 결과로 이어질 수 있습니다.
* 실험적 API를 중심으로 애플리케이션의 핵심 인프라를 구축하려는 경우.

### Flow 프리뷰 API
모든 [Flow] 관련 API는 [@FlowPreview][FlowPreview] 어노테이션으로 표시됩니다.
이 어노테이션은 Flow API가 프리뷰(preview) 상태임을 나타냅니다.
저희는 프리뷰 기능에 대해 바이너리, 소스, 의미론적 호환성을 포함하여 릴리스 간 호환성을 보장하지 않습니다.

프리뷰 API를 사용하는 것이 위험할 수 있는 경우:
* 라이브러리/프레임워크를 작성 중이며 안정적인 릴리스 또는 안정적인 API에서 [Flow] API를 사용하려는 경우.
* 애플리케이션의 핵심 인프라에서 [Flow]를 사용하려는 경우.
* [Flow]를 "한번 작성하고 잊어버리는(write-and-forget)" 솔루션으로 사용하고, `kotlinx.coroutines` 업데이트 시 추가 유지보수 비용을 감당할 수 없는 경우.

### 구식 API
구식 API는 [@ObsoleteCoroutinesApi][ObsoleteCoroutinesApi] 어노테이션으로 표시됩니다.
구식 API는 실험적인 API와 유사하지만, 심각한 설계 결함이 이미 알려져 있으며 잠재적인 대체재가 있지만, 아직 구현되지 않았습니다.

이 API의 의미는 변경되지 않지만, 대체재가 준비되는 즉시 사용 중단 주기를 거칠 것입니다.

### 내부 API
내부 API는 [@InternalCoroutinesApi][InternalCoroutinesApi]로 표시되거나 `kotlinx.coroutines.internal` 패키지의 일부입니다.
이 API는 안정성에 대한 보장이 없으며, 향후 릴리스에서 변경 및/또는 제거될 수 있고 그렇게 될 것입니다.
내부 API 사용을 피할 수 없다면, [이슈 트래커](https://github.com/Kotlin/kotlinx.coroutines/issues/new)에 보고해 주십시오.

### 안정적 API
안정적 API는 ABI와 문서화된 의미를 보존하도록 보장됩니다. 만약 어느 시점에 해결 불가능한 설계 결함이 발견된다면,
이 API는 사용 중단 주기를 거치며 가능한 한 오랫동안 바이너리 호환성을 유지할 것입니다.

### 사용 중단 주기
일부 API가 사용 중단되면 여러 단계를 거치며, 각 단계 사이에 최소 한 번의 주요 릴리스가 있습니다.
* 기능은 컴파일 경고와 함께 사용 중단됩니다. 대부분의 경우, IntelliJ IDEA의 도움을 받아 사용 중단된 사용법을 자동으로 마이그레이션할 수 있도록 적절한 대체재(및 해당 `replaceWith` 선언)가 제공됩니다.
* 사용 중단 수준이 `error` 또는 `hidden`으로 증가합니다. 사용 중단된 API에 대해 새로운 코드를 컴파일하는 것이 더 이상 불가능하지만, 여전히 ABI에 존재합니다.
* API가 완전히 제거됩니다. 그렇게 하지 않기 위해 최선을 다하고 있으며 어떠한 API도 제거할 계획이 없지만, 보안 취약점과 같은 예상치 못한 문제의 경우에도 이 옵션을 남겨두고 있습니다.

## 어노테이션이 적용된 API 사용
모든 API 어노테이션은 [kotlin.Experimental](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-experimental/)입니다.
이는 실험적이거나 구식 API 사용에 대한 컴파일 경고를 생성하기 위함입니다.
경고는 특정 호출 위치에서 프로그래밍 방식으로 비활성화하거나 전체 모듈에 대해 전역적으로 비활성화할 수 있습니다.

### 프로그래밍 방식으로
특정 호출 위치의 경우, [OptIn](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-opt-in/) 어노테이션을 사용하여 경고를 비활성화할 수 있습니다:
```kotlin
@OptIn(ExperimentalCoroutinesApi::class) // Disables warning about experimental coroutines API 
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