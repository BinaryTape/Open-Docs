[//]: # (title: 커스텀 컴파일러 플러그인)

> Kotlin 컴파일러 플러그인 API는 불안정하며 매 릴리스마다 호환성을 깨뜨리는 변경 사항(breaking changes)이 도입됩니다.
> 
{style="warning"}

<include from="compiler-plugins-overview.md" element-id="compiler-plugin-description"/>

커스텀 컴파일러 플러그인을 직접 만들기 전에, [사용 가능한 컴파일러 플러그인 목록](compiler-plugins-overview.md)을 확인하여 사용 사례에 적합한 플러그인이 이미 있는지 확인해 보세요.

또한 [Kotlin Symbol Processing (KSP) API](https://kotlinlang.org/docs/ksp-overview.html)나 [Android lint](https://developer.android.com/studio/write/lint)와 같은 외부 린터(linter)를 사용하여 목표를 달성할 수 있는지도 확인해 보는 것이 좋습니다.

그럼에도 불구하고 필요한 것을 찾을 수 없다면 커스텀 컴파일러 플러그인을 만들 수 있습니다. Kotlin 컴파일러 플러그인 API는 **불안정(unstable)**하다는 점에 유의하세요. 새로운 컴파일러 릴리스마다 호환성을 깨뜨리는 변경 사항이 도입되므로, 이를 유지 관리하기 위해 지속적으로 상당한 노력을 기울여야 합니다.

### Kotlin 컴파일러와 컴파일러 플러그인

<p></p> <!-- workaround for MRK057: Paragraph can only contain inline elements-->
<list columns="2">
    <li>
        <p></p>
        <br/>
        <img src="compiler-stages.svg" width="400" alt="Kotlin compiler stages"/>
    </li>
    <li>
        <p>Kotlin 컴파일러의 작동 방식:</p>
        <ol>
            <li>소스 코드를 파싱하여 구조화된 구문 트리(syntax tree)로 변환합니다.</li>
            <li>코드가 무엇을 의미하는지 결정하고, 이름을 리졸브(resolve)하며, 타입을 체크하고, 가시성 규칙을 적용하여 코드를 분석하고 리졸브합니다.</li>
            <li>소스 코드와 머신 코드 사이의 가교 역할을 하는 데이터 구조인 중간 표현(Intermediate Representation, IR)을 생성합니다.</li>
            <li>IR을 더 단순한 형태로 점진적으로 로워링(lowering)합니다.</li>
            <li>로워링된 IR을 JVM 바이트코드, 자바스크립트 또는 네이티브 머신 코드와 같은 타겟별 출력물로 번역합니다.</li>
        </ol>
    </li>
</list>

플러그인은 프론트엔드(frontend) API를 통해 초기 컴파일러 단계에 영향을 미쳐 컴파일러가 코드를 리졸브하는 방식을 변경할 수 있습니다. 예를 들어, 플러그인은 어노테이션을 추가하거나 본문이 없는 새로운 메서드를 도입하거나 가시성 수정자(visibility modifier)를 변경할 수 있습니다. 이러한 변경 사항은 IDE에서 즉시 확인할 수 있습니다.

플러그인은 백엔드(backend) API를 통해 이후 단계에 영향을 미쳐 선언(declaration)의 동작을 수정할 수도 있습니다. 이러한 변경 사항은 컴파일이 완료된 후 생성된 바이너리에 나타납니다.

실무에서 컴파일러 플러그인은 분석 및 리졸브 단계부터 코드 생성 단계까지 프론트엔드와 백엔드 모두를 아우르며 영향을 미칩니다. 예를 들어, 프론트엔드 파트에서 선언을 생성하고 백엔드 파트에서 해당 선언의 본문을 추가하는 식입니다.

![플러그인이 포함된 Kotlin 컴파일러 단계](compiler-stages-with-plugins.svg){width=650}

[Kotlin serialization 플러그인](https://github.com/Kotlin/kotlinx.serialization)이 좋은 예입니다. 이 플러그인의 프론트엔드 파트는 컴패니언 객체(companion object)와 시리얼라이저 함수를 추가하고 이름 충돌을 방지하기 위한 체크를 수행합니다. 백엔드 파트는 `KSerializer` 객체를 통해 원하는 직렬화 동작을 구현합니다.

### Kotlin 컴파일러 플러그인 템플릿

커스텀 컴파일러 플러그인 작성을 시작하려면 [Kotlin 컴파일러 플러그인 템플릿](https://github.com/Kotlin/compiler-plugin-template)을 사용할 수 있습니다. 그런 다음 프론트엔드 및 백엔드 플러그인 API에서 확장 포인트(extension points)를 등록합니다.

> 현재 커스텀 컴파일러 플러그인은 [Gradle](gradle.md)을 통해서만 개발할 수 있습니다.
> 
{style="note"}

### 프론트엔드 플러그인 API

프론트엔드 플러그인 API(프론트엔드 중간 표현 또는 FIR이라고도 함)는 리졸브 과정을 커스텀하기 위해 다음과 같은 특화된 확장 포인트를 제공합니다.

| 확장 이름 | 설명 |
|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------|
| [`FirAdditionalCheckersExtension`](https://github.com/JetBrains/kotlin/blob/master/compiler/fir/checkers/src/org/jetbrains/kotlin/fir/analysis/extensions/FirAdditionalCheckersExtension.kt) | 커스텀 컴파일러 체커(checker)를 추가합니다. |
| [`FirDeclarationGenerationExtension`](https://github.com/JetBrains/kotlin/blob/master/compiler/fir/providers/src/org/jetbrains/kotlin/fir/extensions/FirDeclarationGenerationExtension.kt)   | 새로운 선언을 생성합니다. |
| [`FirExtensionSessionComponent`](https://github.com/JetBrains/kotlin/blob/master/compiler/fir/tree/src/org/jetbrains/kotlin/fir/extensions/FirExtensionSessionComponent.kt)                  | 플러그인의 다른 파트에서 사용할 커스텀 컴포넌트를 `FirSession`에 등록합니다. |
| [`FirFunctionTypeKindExtension`](https://github.com/JetBrains/kotlin/blob/master/compiler/fir/tree/src/org/jetbrains/kotlin/fir/extensions/FirFunctionTypeKindExtension.kt)                  | 함수형 타입의 새로운 패밀리를 정의합니다. |
| [`FirMetadataSerializerPlugin`](https://github.com/JetBrains/kotlin/blob/master/compiler/fir/fir-serialization/src/org/jetbrains/kotlin/fir/serialization/FirMetadataSerializerPlugin.kt)    | 선언 메타데이터에 정보를 읽고 씁니다. |
| [`FirStatusTransformerExtension`](https://github.com/JetBrains/kotlin/blob/master/compiler/fir/resolve/src/org/jetbrains/kotlin/fir/extensions/FirStatusTransformerExtension.kt)             | 가시성이나 모달리티(modality)와 같은 선언 상태 속성을 수정합니다. |
| [`FirSupertypeGenerationExtension`](https://github.com/JetBrains/kotlin/blob/master/compiler/fir/resolve/src/org/jetbrains/kotlin/fir/extensions/FirSupertypeGenerationExtension.kt)         | 기존 클래스에 새로운 상위 타입(supertype)을 추가합니다. |
| [`FirTypeAttributeExtension`]( https://github.com/JetBrains/kotlin/blob/master/compiler/fir/tree/src/org/jetbrains/kotlin/fir/extensions/FirTypeAttributeExtension.kt)                       | 타입 어노테이션에 기반하여 특정 타입에 특별한 속성을 추가합니다. |

#### IDE 통합

리졸브의 변경 사항은 코드 하이라이팅 및 제안과 같은 IDE 동작에 영향을 미치므로, 플러그인이 IDE와 호환되는 것이 중요합니다. IntelliJ IDEA 및 Android Studio의 각 버전에는 Kotlin 컴파일러의 개발 버전이 포함되어 있습니다. 이 버전은 해당 IDE에 종속적이며 정식 출시된 Kotlin 컴파일러와 바이너리 호환성이 없습니다. 결과적으로 IDE를 업데이트할 때 플러그인이 계속 작동하도록 컴파일러 플러그인도 업데이트해야 합니다. 이러한 이유로 커뮤니티 플러그인은 기본적으로 로드되지 않습니다.

커스텀 컴파일러 플러그인이 다양한 IDE 버전에서 작동하도록 하려면, 각 IDE 버전에 대해 테스트하고 발견된 문제를 수정하세요.

Kotlin 컴파일러 플러그인용 devkit이 제공된다면 여러 IDE 버전을 지원하는 것이 더 쉬워질 수 있습니다. 이 기능에 관심이 있다면 [이슈 트래커](https://youtrack.jetbrains.com/issue/KT-82617)에서 의견을 공유해 주세요.

### 백엔드 플러그인 API

> 백엔드 플러그인 개발은 IDE나 디버거 성능을 저하시키지 않고 올바르게 수행하기 어렵기 때문에, 변경 사항을 적용할 때 주의를 기울이고 보수적으로 접근해야 합니다.
> 
{style="warning"}

백엔드 플러그인 API(IR이라고도 함)는 단일 확장 포인트를 가집니다: [`IrGenerationExtension`](https://github.com/JetBrains/kotlin/blob/master/compiler/ir/backend.common/src/org/jetbrains/kotlin/backend/common/extensions/IrGenerationExtension.kt). 이 확장 포인트를 사용하고 `generate()` 함수를 오버라이드하여 프론트엔드에서 이미 생성된 선언에 본문을 추가하거나 기존 선언 본문을 변경할 수 있습니다.

이 확장 포인트를 통한 변경 사항은 컴파일러에 의해 **체크되지 않습니다**. 변경 사항이 이 단계에서 컴파일러의 기대치를 깨뜨리지 않는지 직접 확인해야 합니다. 예를 들어, 실수로 유효하지 않은 타입을 도입하거나, 잘못된 함수 참조를 만들거나, 올바른 스코프를 벗어난 참조를 만들 수 있습니다.

#### 백엔드 플러그인 코드 탐색하기

Kotlin serialization 플러그인 코드를 살펴보면 실제 백엔드 플러그인 컴파일러 코드가 어떻게 생겼는지 확인할 수 있습니다. 예를 들어, [`SerializableCompanionIrGenerator.kt`](https://github.com/JetBrains/kotlin/blob/master/plugins/kotlinx-serialization/kotlinx-serialization.backend/src/org/jetbrains/kotlinx/serialization/compiler/backend/ir/SerializerIrGenerator.kt)는 핵심 시리얼라이저 멤버에서 누락된 본문을 채워 넣습니다. 한 가지 예로 [`generateChildSerializersGetter()`](https://github.com/JetBrains/kotlin/blob/9cfa558902abc13d245c825717026af63ef82dd2/plugins/kotlinx-serialization/kotlinx-serialization.backend/src/org/jetbrains/kotlinx/serialization/compiler/backend/ir/SerializerIrGenerator.kt#L242) 함수가 있는데, 이 함수는 `KSerializer` 표현식 목록을 수집하여 배열로 반환합니다.

#### 백엔드 플러그인 코드의 문제점 확인하기

백엔드 플러그인 코드의 문제를 세 가지 방법으로 확인할 수 있습니다.

1. **IR 검증 (Verify the IR)**

    IR 트리를 빌드하고 `Xverify-ir` 컴파일러 옵션을 활성화합니다. 이 옵션은 컴파일 속도에 영향을 미치므로 테스트 중에만 사용하세요.

2. **IR 출력 덤프 및 비교**

    `-Xphases-to-dump-before=ExternalPackageParentPatcherLowering` 컴파일러 옵션을 사용하여 IR 로워링 컴파일 단계 이후에 덤프 파일을 생성합니다. JVM 백엔드의 경우 `-Xdump-directory=<your-file-directory>` 컴파일러 옵션으로 덤프 디렉토리를 구성합니다. 예상되는 코드를 수동으로 작성하고 다른 덤프 파일을 생성한 다음, 두 파일을 비교하여 차이점이 있는지 확인합니다.

3. **컴파일러 코드 디버깅**

    `convertToIr.kt` 파일의 `convertToIrAndActualize()` 함수에 중단점(breakpoint)을 추가하고 디버그 모드에서 컴파일러를 실행하여 컴파일 중에 더 상세한 정보를 얻습니다.

### 플러그인 테스트

플러그인을 구현한 후에는 철저히 테스트하세요. [Kotlin 컴파일러 플러그인 템플릿](https://github.com/Kotlin/compiler-plugin-template)은 이미 [Kotlin 컴파일러 테스트 프레임워크](https://github.com/JetBrains/kotlin/blob/master/compiler/test-infrastructure/ReadMe.md)를 사용하도록 설정되어 있습니다. 다음 디렉토리에 테스트를 추가할 수 있습니다.

* `compiler-plugin/testData`
* 코드 생성 테스트를 위한 `compiler-plugin/testData/box`
* 진단(diagnostic) 테스트를 위한 `compiler-plugin/testData/diagnostics`

테스트가 실행되면 프레임워크는 다음을 수행합니다.

1. 테스트 소스 파일을 파싱합니다. (예: [`anotherBoxTest.kt`](https://github.com/Kotlin/compiler-plugin-template/blob/master/compiler-plugin/testData/box/anotherBoxTest.kt))
2. 각 파일에 대해 FIR 및 IR을 빌드합니다.
3. 이를 텍스트 덤프 파일로 작성합니다. (예: [`anotherBoxTest.fir.txt`](https://github.com/Kotlin/compiler-plugin-template/blob/master/compiler-plugin/testData/box/anotherBoxTest.fir.txt) 및 [`anotherBoxTest.fir.ir.txt`](https://github.com/Kotlin/compiler-plugin-template/blob/master/compiler-plugin/testData/box/anotherBoxTest.fir.ir.txt))
4. 이 파일들을 이전에 생성된 파일(있는 경우)과 비교합니다.

이 파일들을 사용하여 생성된 diff에 의도하지 않은 변경 사항이 있는지 확인할 수 있습니다. 문제가 없다면 새로운 덤프 파일이 최신 _골든(golden)_ 파일이 됩니다. 이는 향후 변경 사항과 비교할 수 있는 승인되고 신뢰할 수 있는 소스가 됩니다.

### 도움 받기

커스텀 컴파일러 플러그인을 개발하다가 문제에 부딪히면 [Kotlin Slack](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up)의 [#compiler](https://slack-chats.kotlinlang.org/c/compiler) 채널에 문의해 주세요. 해결을 보장할 수는 없지만 가능한 한 도움을 드리기 위해 노력하겠습니다.