[//]: # (title: 증분 처리)

증분 처리(incremental processing)는 소스(source)의 재처리를 최대한 피하는 처리 기법입니다.
증분 처리의 주요 목표는 일반적인 변경-컴파일-테스트 주기의 처리 시간을 줄이는 것입니다.
자세한 내용은 위키백과의 [증분 컴퓨팅(incremental computing)](https://en.wikipedia.org/wiki/Incremental_computing) 문서를 참조하세요.

어떤 소스가 _오염되었는지_ (즉, 재처리해야 하는지) 결정하기 위해 KSP는 프로세서(processor)의 도움이 필요합니다. 프로세서는 어떤 입력 소스가 어떤 생성된 출력에 해당하는지 식별해야 합니다. 종종 번거롭고 오류가 발생하기 쉬운 이 프로세스를 돕기 위해 KSP는 프로세서가 코드 구조를 탐색하기 위한 시작점으로 사용하는 최소한의 _루트 소스(root source)_만 요구하도록 설계되었습니다. 즉, `KSNode`가 다음 중 하나로부터 얻어진 경우 프로세서는 출력과 해당 `KSNode`의 소스를 연결해야 합니다.
* `Resolver.getAllFiles`
* `Resolver.getSymbolsWithAnnotation`
* `Resolver.getClassDeclarationByName`
* `Resolver.getDeclarationsFromPackage`

증분 처리는 현재 기본적으로 활성화되어 있습니다. 비활성화하려면 Gradle 속성 `ksp.incremental=false`를 설정하세요.
의존성(dependency)과 출력(output)에 따라 오염된 세트(dirty set)를 덤프(dump)하는 로그를 활성화하려면 `ksp.incremental.log=true`를 사용하세요.
이러한 로그 파일은 `.log` 파일 확장자를 가진 `build` 출력 디렉터리(output directory)에서 찾을 수 있습니다.

JVM에서는 클래스패스(classpath) 변경뿐만 아니라 Kotlin 및 Java 소스 변경도 기본적으로 추적됩니다.
Kotlin 및 Java 소스 변경만 추적하려면 `ksp.incremental.intermodule=false` Gradle 속성을 설정하여 클래스패스 추적을 비활성화하세요.

## 집계 vs 격리

[Gradle 어노테이션(annotation) 처리](https://docs.gradle.org/current/userguide/java_plugin.html#sec:incremental_annotation_processing)의 개념과 유사하게 KSP는 _집계(aggregating)_ 모드와 _격리(isolating)_ 모드 모두를 지원합니다. Gradle 어노테이션 처리와 달리 KSP는 전체 프로세서가 아닌 각 출력(output)을 집계 또는 격리로 분류합니다.

집계 출력(aggregating output)은 다른 파일에 영향을 주지 않는 파일 제거를 제외하고 모든 입력 변경에 의해 잠재적으로 영향을 받을 수 있습니다. 이는 모든 입력 변경이 모든 집계 출력의 재빌드(rebuild)를 초래하고, 이는 다시 해당되는 모든 등록된, 새로 추가된, 그리고 수정된 소스 파일의 재처리를 의미합니다.

예를 들어, 특정 어노테이션을 가진 모든 심볼(symbol)을 수집하는 출력은 집계 출력으로 간주됩니다.

격리 출력(isolating output)은 지정된 소스에만 의존합니다. 다른 소스에 대한 변경은 격리 출력에 영향을 주지 않습니다.
Gradle 어노테이션 처리와 달리 주어진 출력에 대해 여러 소스 파일을 정의할 수 있습니다.

예를 들어, 구현하는 인터페이스(interface) 전용으로 생성된 클래스(class)는 격리 출력으로 간주됩니다.

요약하자면, 출력이 새 소스 또는 변경된 소스에 의존할 수 있다면 집계 출력으로 간주됩니다.
그렇지 않으면 출력은 격리 출력입니다.

Java 어노테이션 처리에 익숙한 독자를 위한 요약입니다.
* 격리 Java 어노테이션 프로세서에서는 KSP의 모든 출력이 격리 출력입니다.
* 집계 Java 어노테이션 프로세서에서는 KSP의 일부 출력이 격리 출력일 수 있고 일부는 집계 출력일 수 있습니다.

### 구현 방식

의존성(dependency)은 어노테이션 대신 입력 및 출력 파일의 연결에 의해 계산됩니다.
이는 다대다(many-to-many) 관계입니다.

입력-출력 연결로 인한 오염 전파 규칙은 다음과 같습니다.
1. 입력 파일이 변경되면 항상 재처리됩니다.
2. 입력 파일이 변경되고 출력과 연결되어 있다면, 동일한 출력과 연결된 다른 모든 입력 파일도 재처리됩니다. 이는 전이적(transitive)이며, 즉 새로운 오염된 파일이 없을 때까지 무효화가 반복적으로 발생합니다.
3. 하나 이상의 집계 출력과 연결된 모든 입력 파일은 재처리됩니다. 즉, 입력 파일이 어떤 집계 출력과도 연결되어 있지 않다면 재처리되지 않습니다 (위 1. 또는 2.에 해당하지 않는 한).

이유는 다음과 같습니다.
1. 입력이 변경되면 새로운 정보가 도입될 수 있으며, 따라서 프로세서는 해당 입력을 사용하여 다시 실행해야 합니다.
2. 출력은 일련의 입력으로 구성됩니다. 프로세서는 출력을 다시 생성하기 위해 모든 입력이 필요할 수 있습니다.
3. `aggregating=true`는 출력이 새로운 정보에 잠재적으로 의존할 수 있음을 의미하며, 이는 새 파일 또는 변경된 기존 파일에서 올 수 있습니다.
4. `aggregating=false`는 프로세서가 정보가 특정 입력 파일에서만 오며 다른 파일이나 새 파일에서는 절대 오지 않는다고 확신함을 의미합니다.

## 예시 1

프로세서가 `A.kt`의 클래스 `A`와 `B.kt`의 클래스 `B`를 읽은 후 `outputForA`를 생성합니다. 여기서 `A`는 `B`를 상속합니다.
프로세서는 `Resolver.getSymbolsWithAnnotation`을 통해 `A`를 얻었고, `A`로부터 `KSClassDeclaration.superTypes`를 통해 `B`를 얻었습니다.
`B`의 포함이 `A` 때문이므로 `B.kt`는 `outputForA`의 `dependencies`에 지정될 필요가 없습니다.
이 경우에도 `B.kt`를 지정할 수 있지만, 불필요합니다.

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

프로세서가 `sourceA`를 읽은 후 `outputA`를 생성하고 `sourceB`를 읽은 후 `outputB`를 생성한다고 가정해 봅시다.

`sourceA`가 변경될 때:
* `outputB`가 집계 출력이라면, `sourceA`와 `sourceB` 모두 재처리됩니다.
* `outputB`가 격리 출력이라면, `sourceA`만 재처리됩니다.

`sourceC`가 추가될 때:
* `outputB`가 집계 출력이라면, `sourceC`와 `sourceB` 모두 재처리됩니다.
* `outputB`가 격리 출력이라면, `sourceC`만 재처리됩니다.

`sourceA`가 제거될 때, 아무것도 재처리할 필요가 없습니다.

`sourceB`가 제거될 때, 아무것도 재처리할 필요가 없습니다.

## 파일 오염 상태 결정 방식

오염된 파일은 사용자(user)에 의해 직접 _변경_되거나 다른 오염된 파일에 의해 간접적으로 _영향_을 받는 파일입니다. KSP는 두 단계로 오염을 전파합니다.
* _해결 추적(resolution tracing)_에 의한 전파:
  타입(type) 참조를 해결하는 것(암시적으로든 명시적으로든)은 한 파일에서 다른 파일로 이동하는 유일한 방법입니다. 프로세서에 의해 타입 참조가 해결될 때, 해결 결과에 잠재적으로 영향을 줄 수 있는 변경을 포함하는 변경되거나 영향을 받은 파일은 해당 참조를 포함하는 파일에 영향을 줍니다.
* _입력-출력 대응(input-output correspondence)_에 의한 전파:
  소스 파일이 변경되거나 영향을 받으면, 해당 파일과 공통된 출력을 가진 다른 모든 소스 파일이 영향을 받습니다.

이 두 가지 모두 전이적(transitive)이며, 두 번째는 동치류(equivalence classes)를 형성합니다.

## 버그 보고

버그를 보고하려면 Gradle 속성 `ksp.incremental=true`와 `ksp.incremental.log=true`를 설정한 후 클린 빌드(clean build)를 수행하세요.
이 빌드는 다음 두 개의 로그 파일을 생성합니다.

* `build/kspCaches/<source set>/logs/kspDirtySet.log`
* `build/kspCaches/<source set>/logs/kspSourceToOutputs.log`

그 다음 연속적인 증분 빌드(incremental build)를 실행하면 두 개의 추가 로그 파일이 생성됩니다.

* `build/kspCaches/<source set>/logs/kspDirtySetByDeps.log`
* `build/kspCaches/<source set>/logs/kspDirtySetByOutputs.log`

이 로그에는 소스 및 출력의 파일 이름과 빌드의 타임스탬프(timestamp)가 포함됩니다.