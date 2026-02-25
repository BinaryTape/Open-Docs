[//]: # (title: 증분 처리)

증분 처리(Incremental processing)는 소스 파일의 재처리를 가능한 한 피하는 처리 기술입니다.
증분 처리의 주요 목표는 일반적인 '수정-컴파일-테스트' 주기의 소요 시간을 단축하는 것입니다.
일반적인 정보는 위키백과의 [증분 컴퓨팅(incremental computing)](https://en.wikipedia.org/wiki/Incremental_computing) 문서를 참조하세요.

어떤 소스가 _수정되었는지(dirty)_ (재처리가 필요한 소스) 결정하기 위해, KSP는 프로세서의 도움을 받아 어떤 입력 소스가 어떤 생성된 출력에 대응하는지 식별해야 합니다. 종종 번거롭고 오류가 발생하기 쉬운 이 과정을 돕기 위해, KSP는 프로세서가 코드 구조를 탐색하기 위한 시작점으로 사용하는 최소한의 _루트 소스(root sources)_ 세트만 요구하도록 설계되었습니다. 다시 말해, 프로세서는 다음 중 하나로부터 `KSNode`를 얻은 경우, 해당 출력과 대응하는 `KSNode`의 소스를 연결해야 합니다:
* `Resolver.getAllFiles`
* `Resolver.getSymbolsWithAnnotation`
* `Resolver.getClassDeclarationByName`
* `Resolver.getDeclarationsFromPackage`

증분 처리는 현재 기본적으로 활성화되어 있습니다. 이를 비활성화하려면 Gradle 속성 `ksp.incremental=false`를 설정하세요.
의존성 및 출력에 따라 수정된(dirty) 세트를 덤프하는 로그를 활성화하려면 `ksp.incremental.log=true`를 사용하세요.
이 로그 파일들은 `build` 출력 디렉토리에서 `.log` 확장자로 찾을 수 있습니다.

JVM에서는 클래스패스(classpath) 변경 사항뿐만 아니라 Kotlin 및 Java 소스 변경 사항도 기본적으로 추적됩니다.
Kotlin 및 Java 소스 변경 사항만 추적하려면 `ksp.incremental.intermodule=false` Gradle 속성을 설정하여 클래스패스 추적을 비활성화하세요.

## 집계형(Aggregating) vs 격리형(Isolating)

[Gradle 어노테이션 처리(Gradle annotation processing)](https://docs.gradle.org/current/userguide/java_plugin.html#sec:incremental_annotation_processing)의 개념과 유사하게, KSP는 _집계형(aggregating)_ 및 _격리형(isolating)_ 모드를 모두 지원합니다. Gradle 어노테이션 처리와 달리, KSP는 프로세서 전체가 아닌 각 출력을 집계형 또는 격리형으로 분류한다는 점에 유의하세요.

**집계형(aggregating)** 출력은 다른 파일에 영향을 주지 않는 파일을 삭제하는 경우를 제외하고, 모든 입력 변경에 의해 잠재적으로 영향을 받을 수 있습니다. 즉, 모든 입력 변경은 모든 집계형 출력의 재빌드로 이어지며, 이는 결국 대응하는 모든 등록된 소스, 새 소스 및 수정된 소스 파일의 재처리를 의미합니다.

예를 들어, 특정 어노테이션이 있는 모든 심볼을 수집하는 출력은 집계형 출력으로 간주됩니다.

**격리형(isolating)** 출력은 지정된 소스에만 의존합니다. 다른 소스의 변경은 격리형 출력에 영향을 주지 않습니다. Gradle 어노테이션 처리와 달리, 지정된 출력에 대해 여러 소스 파일을 정의할 수 있습니다.

예를 들어, 구현하는 인터페이스 전용으로 생성된 클래스는 격리형으로 간주됩니다.

요약하자면, 출력이 새로운 소스나 변경된 소스에 의존할 가능성이 있다면 집계형입니다. 그렇지 않으면 격리형입니다.

Java 어노테이션 처리에 익숙한 독자를 위한 요약은 다음과 같습니다:
* 격리형 Java 어노테이션 프로세서의 경우, KSP에서 모든 출력은 격리형입니다.
* 집계형 Java 어노테이션 프로세서의 경우, KSP에서 일부 출력은 격리형일 수 있고 일부는 집계형일 수 있습니다.

### 구현 방식

의존성은 어노테이션이 아닌 입력 파일과 출력 파일의 연결을 통해 계산됩니다.
이는 다대다(many-to-many) 관계입니다.

입출력 연결에 따른 수정 상태 전파(dirtiness propagation) 규칙은 다음과 같습니다:
1. 입력 파일이 변경되면 항상 재처리됩니다.
2. 입력 파일이 변경되고 해당 파일이 출력과 연결되어 있다면, 동일한 출력과 연결된 다른 모든 입력 파일도 재처리됩니다. 이는 전이적(transitive)입니다. 즉, 더 이상 새로운 수정된(dirty) 파일이 없을 때까지 무효화가 반복해서 발생합니다.
3. 하나 이상의 집계형 출력과 연결된 모든 입력 파일은 재처리됩니다. 즉, 입력 파일이 어떤 집계형 출력과도 연결되어 있지 않다면, (위의 1번 또는 2번에 해당하지 않는 한) 재처리되지 않습니다.

이유는 다음과 같습니다:
1. 입력이 변경되면 새로운 정보가 도입될 수 있으므로 프로세서는 해당 입력을 사용하여 다시 실행되어야 합니다.
2. 출력은 입력 세트로 만들어집니다. 프로세서는 출력을 다시 생성하기 위해 모든 입력이 필요할 수 있습니다.
3. `aggregating=true`는 출력이 새로운 파일이나 변경된 기존 파일로부터 올 수 있는 새로운 정보에 잠재적으로 의존할 수 있음을 의미합니다.
   `aggregating=false`는 프로세서가 해당 정보가 특정 입력 파일에서만 오며 다른 파일이나 새 파일에서는 절대 오지 않는다고 확신함을 의미합니다.

## 예제 1

프로세서가 `A.kt`의 `A` 클래스와 `B.kt`의 `B` 클래스를 읽은 후 `outputForA`를 생성한다고 가정해 보겠습니다. 여기서 `A`는 `B`를 상속합니다.
프로세서는 `Resolver.getSymbolsWithAnnotation`을 통해 `A`를 얻었고, `A`로부터 `KSClassDeclaration.superTypes`를 통해 `B`를 얻었습니다.
`B`의 포함은 `A`로 인한 것이므로, `outputForA`의 `dependencies`에 `B.kt`를 지정할 필요는 없습니다.
이 경우에도 `B.kt`를 지정할 수는 있지만, 불필요합니다.

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
        // KSP에 의해 의존성으로 추론될 수 있으므로 B.kt는 필요하지 않습니다.
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

## 예제 2

프로세서가 `sourceA`를 읽어 `outputA`를 생성하고, `sourceB`를 읽어 `outputB`를 생성한다고 가정해 보겠습니다.

`sourceA`가 변경될 때:
* `outputB`가 집계형(aggregating)이면, `sourceA`와 `sourceB` 모두 재처리됩니다.
* `outputB`가 격리형(isolating)이면, `sourceA`만 재처리됩니다.

`sourceC`가 추가될 때:
* `outputB`가 집계형(aggregating)이면, `sourceC`와 `sourceB` 모두 재처리됩니다.
* `outputB`가 격리형(isolating)이면, `sourceC`만 재처리됩니다.

`sourceA`가 삭제될 때, 아무것도 재처리할 필요가 없습니다.

`sourceB`가 삭제될 때, 아무것도 재처리할 필요가 없습니다.

## 파일 수정 여부 결정 방법

수정된(dirty) 파일은 사용자에 의해 직접 _변경(changed)_ 되었거나, 다른 수정된 파일에 의해 간접적으로 _영향(affected)_을 받은 파일입니다. KSP는 두 단계를 거쳐 수정 상태를 전파합니다:
* **해석 추적(resolution tracing)에 의한 전파**:
  타입 참조를 (암시적 또는 명시적으로) 해석(resolving)하는 것이 한 파일에서 다른 파일로 이동하는 유일한 방법입니다.
  프로세서에 의해 타입 참조가 해석될 때, 해석 결과에 잠재적으로 영향을 줄 수 있는 변경 사항을 포함하는 변경되거나 영향받은 파일은 해당 참조를 포함하는 파일에 영향을 줍니다.
* **입출력 대응(input-output correspondence)에 의한 전파**:
  소스 파일이 변경되거나 영향을 받으면, 해당 파일과 공통된 출력을 갖는 다른 모든 소스 파일이 영향을 받습니다.

두 방식 모두 전이적(transitive)이며, 두 번째 방식은 동치류(equivalence classes)를 형성한다는 점에 유의하세요.

## 버그 보고

버그를 보고하려면 Gradle 속성 `ksp.incremental=true` 및 `ksp.incremental.log=true`를 설정하고 클린 빌드(clean build)를 수행하세요.
이 빌드는 두 개의 로그 파일을 생성합니다:

* `build/kspCaches/<source set>/logs/kspDirtySet.log`
* `build/kspCaches/<source set>/logs/kspSourceToOutputs.log`

그런 다음 연속해서 증분 빌드를 실행하면 두 개의 추가 로그 파일이 생성됩니다:

* `build/kspCaches/<source set>/logs/kspDirtySetByDeps.log`
* `build/kspCaches/<source set>/logs/kspDirtySetByOutputs.log`

이 로그들에는 소스 및 출력의 파일 이름과 빌드 타임스탬프가 포함되어 있습니다.