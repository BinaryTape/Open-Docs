[//]: # (title: 증분 처리)

증분 처리는 소스 재처리를 가능한 한 피하는 처리 기법입니다.
증분 처리의 주요 목표는 일반적인 변경-컴파일-테스트 주기의 소요 시간을 줄이는 것입니다.
자세한 내용은 위키백과의 [증분 컴퓨팅](https://en.wikipedia.org/wiki/Incremental_computing) 문서를 참조하십시오.

어떤 소스가 변경되었는지 (재처리되어야 하는 소스)를 결정하기 위해 KSP는 프로세서의 도움을 받아 어떤 입력 소스가 어떤 생성된 출력에 해당하는지 식별해야 합니다. 이 번거롭고 오류가 발생하기 쉬운 과정을 돕기 위해 KSP는 프로세서가 코드 구조를 탐색하는 시작점으로 사용하는 최소한의 _루트 소스_ 집합만 요구하도록 설계되었습니다. 다시 말해, `KSNode`가 다음 중 하나에서 얻어진 경우 프로세서는 해당 `KSNode`의 소스와 출력을 연결해야 합니다:
* `Resolver.getAllFiles`
* `Resolver.getSymbolsWithAnnotation`
* `Resolver.getClassDeclarationByName`
* `Resolver.getDeclarationsFromPackage`

증분 처리는 현재 기본적으로 활성화되어 있습니다. 비활성화하려면 Gradle 속성 `ksp.incremental=false`를 설정하십시오.
의존성 및 출력에 따라 변경된 집합을 덤프하는 로그를 활성화하려면 `ksp.incremental.log=true`를 사용하십시오.
이러한 로그 파일은 `build` 출력 디렉터리에서 `.log` 파일 확장자로 찾을 수 있습니다.

JVM에서는 클래스패스 변경뿐만 아니라 코틀린 및 자바 소스 변경도 기본적으로 추적됩니다.
코틀린 및 자바 소스 변경만 추적하려면 `ksp.incremental.intermodule=false` Gradle 속성을 설정하여 클래스패스 추적을 비활성화하십시오.

## 집계 (Aggregating) vs 격리 (Isolating)

[Gradle 어노테이션 처리](https://docs.gradle.org/current/userguide/java_plugin.html#sec:incremental_annotation_processing)의 개념과 유사하게, KSP는 _집계 (aggregating)_ 및 _격리 (isolating)_ 모드를 모두 지원합니다. Gradle 어노테이션 처리와 달리 KSP는 전체 프로세서가 아닌 각 출력을 집계 또는 격리로 분류한다는 점에 유의하십시오.

집계 출력은 다른 파일에 영향을 주지 않는 파일 제거를 제외하고 잠재적으로 모든 입력 변경에 영향을 받을 수 있습니다. 이는 모든 입력 변경이 모든 집계 출력의 재빌드를 초래하며, 이는 결국 모든 해당 등록된, 새롭고 수정된 소스 파일의 재처리를 의미합니다.

예를 들어, 특정 어노테이션을 가진 모든 심볼을 수집하는 출력은 집계 출력으로 간주됩니다.

격리 출력은 지정된 소스에만 의존합니다. 다른 소스에 대한 변경 사항은 격리 출력에 영향을 주지 않습니다. Gradle 어노테이션 처리와 달리 단일 출력에 대해 여러 소스 파일을 정의할 수 있습니다.

예를 들어, 구현하는 인터페이스에 전용으로 생성된 클래스는 격리로 간주됩니다.

요약하자면, 출력이 새로운 소스 또는 변경된 소스에 의존할 수 있다면 집계로 간주됩니다.
그렇지 않으면 출력은 격리입니다.

자바 어노테이션 처리(Java annotation processing)에 익숙한 독자를 위한 요약입니다:
* 격리 자바 어노테이션 프로세서에서 모든 출력은 KSP에서 격리입니다.
* 집계 자바 어노테이션 프로세서에서 일부 출력은 KSP에서 격리일 수 있고 일부는 집계일 수 있습니다.

### 구현 방식

의존성은 어노테이션 대신 입력 및 출력 파일의 연결로 계산됩니다.
이는 다대다 관계입니다.

입력-출력 연결로 인한 변경 상태 전파 규칙은 다음과 같습니다:
1. 입력 파일이 변경되면 항상 재처리됩니다.
2. 입력 파일이 변경되고, 특정 출력과 연결되어 있는 경우, 해당 출력과 연결된 다른 모든 입력 파일도 재처리됩니다. 이는 전이적이며, 즉 새로운 변경된 파일이 없을 때까지 무효화가 반복적으로 발생합니다.
3. 하나 이상의 집계 출력과 연결된 모든 입력 파일은 재처리됩니다. 다시 말해, 입력 파일이 어떤 집계 출력과도 연결되어 있지 않으면 재처리되지 않습니다 (위 1. 또는 2.에 해당하는 경우는 제외).

이유는 다음과 같습니다:
1. 입력이 변경되면 새로운 정보가 도입될 수 있으므로 프로세서는 해당 입력으로 다시 실행되어야 합니다.
2. 출력은 입력 집합으로 구성됩니다. 프로세서는 출력을 재생성하기 위해 모든 입력이 필요할 수 있습니다.
3. `aggregating=true`는 출력이 새로운 정보에 잠재적으로 의존할 수 있음을 의미하며, 이 정보는 새 파일이나 변경된 기존 파일에서 올 수 있습니다.
4. `aggregating=false`는 프로세서가 정보가 특정 입력 파일에서만 오고 다른 파일이나 새 파일에서는 절대 오지 않는다고 확신함을 의미합니다.

## 예시 1

프로세서가 `A.kt`의 클래스 `A`와 `B.kt`의 클래스 `B`를 읽은 후 `outputForA`를 생성합니다. 여기서 `A`는 `B`를 확장합니다.
프로세서는 `Resolver.getSymbolsWithAnnotation`을 통해 `A`를 얻었고, 그 다음 `A`로부터 `KSClassDeclaration.superTypes`를 통해 `B`를 얻었습니다.
`B`의 포함이 `A` 때문이므로, `outputForA`의 `dependencies`에 `B.kt`를 지정할 필요가 없습니다.
이 경우에도 `B.kt`를 지정할 수 있지만, 필수는 아닙니다.

```kotlin
// A.kt
@Interesting
class A : B()

// B.kt
open class B

// Example1Processor.kt
class Example1Processor : SymbolProcessor {
    override fun process(resolver: Resolver) {
        val declA = resolver.getSymbolsWithAnnotation("Interesting").first() as KSClassDeclaration
        val declB = declA.superTypes.first().resolve().declaration
        // B.kt는 KSP에 의해 의존성으로 추론될 수 있으므로 필요하지 않습니다.
        val dependencies = Dependencies(aggregating = true, declA.containingFile!!)
        // outputForA.kt
        val outputName = "outputFor${declA.simpleName.asString()}"
        // outputForA는 A.kt와 B.kt에 의존합니다.
        val output = codeGenerator.createNewFile(dependencies, "com.example", outputName, "kt")
        output.write("// $declA : $declB
".toByteArray())
        output.close()
    }
    // ...
}
```

## 예시 2

프로세서가 `sourceA`를 읽은 후 `outputA`를, `sourceB`를 읽은 후 `outputB`를 생성한다고 가정해 봅시다.

`sourceA`가 변경될 때:
* `outputB`가 집계(aggregating)인 경우, `sourceA`와 `sourceB` 둘 다 재처리됩니다.
* `outputB`가 격리(isolating)인 경우, `sourceA`만 재처리됩니다.

`sourceC`가 추가될 때:
* `outputB`가 집계(aggregating)인 경우, `sourceC`와 `sourceB` 둘 다 재처리됩니다.
* `outputB`가 격리(isolating)인 경우, `sourceC`만 재처리됩니다.

`sourceA`가 제거되면 아무것도 재처리할 필요가 없습니다.

`sourceB`가 제거되면 아무것도 재처리할 필요가 없습니다.

## 파일의 변경 상태 결정 방식

변경된 (dirty) 파일은 사용자에 의해 직접 _변경_되거나 다른 변경된 파일에 의해 간접적으로 _영향을 받은_ 파일입니다. KSP는 두 단계로 변경 상태를 전파합니다:
* _해결 추적(resolution tracing)_에 의한 전파:
  타입 참조를 (암시적으로든 명시적으로든) 해결하는 것이 한 파일에서 다른 파일로 이동하는 유일한 방법입니다.
  프로세서에 의해 타입 참조가 해결될 때, 해결 결과에 잠재적으로 영향을 미칠 수 있는 변경 사항을 포함하는 변경되거나 영향을 받은 파일은 해당 참조를 포함하는 파일에 영향을 미칩니다.
* _입력-출력 대응(input-output correspondence)_에 의한 전파:
  소스 파일이 변경되거나 영향을 받으면, 해당 파일과 공통된 출력을 가진 다른 모든 소스 파일도 영향을 받습니다.

둘 다 전이적이며, 두 번째는 동등성 클래스를 형성한다는 점에 유의하십시오.

## 버그 보고

버그를 보고하려면, Gradle 속성 `ksp.incremental=true`와 `ksp.incremental.log=true`를 설정하고 클린 빌드를 수행하십시오.
이 빌드는 두 개의 로그 파일을 생성합니다:

* `build/kspCaches/<source set>/logs/kspDirtySet.log`
* `build/kspCaches/<source set>/logs/kspSourceToOutputs.log`

그런 다음 연속적인 증분 빌드를 실행할 수 있으며, 이는 두 개의 추가 로그 파일을 생성할 것입니다:

* `build/kspCaches/<source set>/logs/kspDirtySetByDeps.log`
* `build/kspCaches/<source set>/logs/kspDirtySetByOutputs.log`

이 로그에는 소스 및 출력 파일 이름과 빌드의 타임스탬프가 포함되어 있습니다.