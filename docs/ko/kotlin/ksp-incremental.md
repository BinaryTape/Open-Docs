---
title: "증분 처리"
---
증분 처리(Incremental processing)는 가능한 한 소스의 재처리를 피하는 처리 기술입니다.
증분 처리의 주요 목표는 일반적인 변경-컴파일-테스트 주기의 소요 시간을 줄이는 것입니다.
일반적인 정보는 Wikipedia의 [incremental computing](https://en.wikipedia.org/wiki/Incremental_computing) 관련 글을 참조하십시오.

어떤 소스가 _dirty_ (재처리해야 하는 소스)인지 판단하기 위해 KSP는 프로세서가 어떤 입력 소스가 어떤 생성된 출력에 해당하는지 식별하도록 도와야 합니다.
이러한 종종 번거롭고 오류가 발생하기 쉬운 프로세스를 돕기 위해 KSP는 프로세서가 코드 구조를 탐색하기 위한 시작점으로 사용하는 최소한의 _root sources_ 집합만 필요하도록 설계되었습니다.
즉, 프로세서는 다음 중 하나에서 `KSNode`를 얻은 경우 해당 `KSNode`의 소스와 출력을 연결해야 합니다.
* `Resolver.getAllFiles`
* `Resolver.getSymbolsWithAnnotation`
* `Resolver.getClassDeclarationByName`
* `Resolver.getDeclarationsFromPackage`

증분 처리는 현재 기본적으로 활성화되어 있습니다. 비활성화하려면 Gradle 속성 `ksp.incremental=false`를 설정하세요.
종속성 및 출력에 따라 dirty set을 덤프하는 로그를 활성화하려면 `ksp.incremental.log=true`를 사용하세요.
이러한 로그 파일은 `.log` 파일 확장자와 함께 `build` 출력 디렉터리에서 찾을 수 있습니다.

JVM에서는 classpath 변경 사항과 Kotlin 및 Java 소스 변경 사항이 기본적으로 추적됩니다.
Kotlin 및 Java 소스 변경 사항만 추적하려면 `ksp.incremental.intermodule=false` Gradle 속성을 설정하여 classpath 추적을 비활성화하세요.

## Aggregating vs Isolating

[Gradle annotation processing](https://docs.gradle.org/current/userguide/java_plugin.html#sec:incremental_annotation_processing)의 개념과 유사하게 KSP는 _aggregating_ 및 _isolating_ 모드를 모두 지원합니다.
Gradle annotation processing과 달리 KSP는 전체 프로세서가 아닌 각 출력을 aggregating 또는 isolating으로 분류합니다.

aggregating 출력은 다른 파일에 영향을 주지 않는 파일 제거를 제외하고 모든 입력 변경의 영향을 받을 수 있습니다.
이는 모든 입력 변경으로 인해 모든 aggregating 출력이 다시 빌드되고, 결과적으로 등록된 새 소스 파일과 수정된 소스 파일이 모두 다시 처리됨을 의미합니다.

예를 들어, 특정 annotation이 있는 모든 심볼을 수집하는 출력은 aggregating 출력으로 간주됩니다.

isolating 출력은 지정된 소스에만 의존합니다. 다른 소스에 대한 변경 사항은 isolating 출력에 영향을 주지 않습니다.
Gradle annotation processing과 달리 지정된 출력에 대해 여러 소스 파일을 정의할 수 있습니다.

예를 들어, 구현하는 인터페이스 전용으로 생성된 클래스는 isolating으로 간주됩니다.

요약하자면, 출력이 새 소스 또는 변경된 소스에 의존할 수 있는 경우 aggregating으로 간주됩니다.
그렇지 않으면 출력이 isolating입니다.

Java annotation processing에 익숙한 독자를 위한 요약은 다음과 같습니다.
* isolating Java annotation processor에서 모든 출력은 KSP에서 isolating입니다.
* aggregating Java annotation processor에서 일부 출력은 isolating일 수 있고 일부 출력은 KSP에서 aggregating일 수 있습니다.

### 구현 방법

종속성은 annotation 대신 입력 및 출력 파일의 연결을 통해 계산됩니다.
이는 다대다 관계입니다.

입출력 연결로 인한 dirtiness 전파 규칙은 다음과 같습니다.
1. 입력 파일이 변경되면 항상 재처리됩니다.
2. 입력 파일이 변경되고 출력과 연결된 경우 동일한 출력과 연결된 다른 모든 입력 파일도 재처리됩니다.
   이는 전이적이며, 즉 새로운 dirty 파일이 없을 때까지 무효화가 반복적으로 발생합니다.
3. 하나 이상의 aggregating 출력과 연결된 모든 입력 파일이 재처리됩니다.
   즉, 입력 파일이 aggregating 출력과 연결되어 있지 않으면 위 1 또는 2를 충족하지 않는 한 재처리되지 않습니다.

이유는 다음과 같습니다.
1. 입력이 변경되면 새로운 정보가 도입될 수 있으므로 프로세서가 입력을 다시 실행해야 합니다.
2. 출력은 입력 세트로 구성됩니다. 프로세서는 출력을 다시 생성하기 위해 모든 입력이 필요할 수 있습니다.
3. `aggregating=true`는 출력이 잠재적으로 새로운 정보에 의존할 수 있음을 의미하며, 이는 새로운 파일 또는 변경된 기존 파일에서 나올 수 있습니다.
   `aggregating=false`는 프로세서가 정보가 특정 입력 파일에서만 나오고 다른 파일이나 새 파일에서는 절대 나오지 않는다고 확신한다는 의미입니다.

## 예제 1

프로세서는 `A.kt`에서 클래스 `A`와 `B.kt`에서 클래스 `B`를 읽은 후 `outputForA`를 생성합니다. 여기서 `A`는 `B`를 확장합니다.
프로세서는 `Resolver.getSymbolsWithAnnotation`으로 `A`를 가져온 다음 `A`에서 `KSClassDeclaration.superTypes`로 `B`를 가져왔습니다.
`B`의 포함은 `A` 때문이므로 `B.kt`를 `outputForA`에 대한 `dependencies`에 지정할 필요가 없습니다.
이 경우 `B.kt`를 지정할 수 있지만 불필요합니다.

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
        // B.kt는 KSP에서 종속성으로 추론할 수 있으므로 필요하지 않습니다.
        val dependencies = Dependencies(aggregating = true, declA.containingFile!!)
        // outputForA.kt
        val outputName = "outputFor${declA.simpleName.asString()}"
        // outputForA는 A.kt 및 B.kt에 의존합니다.
        val output = codeGenerator.createNewFile(dependencies, "com.example", outputName, "kt")
        output.write("// $declA : $declB
".toByteArray())
        output.close()
    }
    // ...
}
```

## 예제 2

프로세서가 `sourceA`를 읽은 후 `outputA`를 생성하고 `sourceB`를 읽은 후 `outputB`를 생성한다고 가정합니다.

`sourceA`가 변경된 경우:
* `outputB`가 aggregating이면 `sourceA`와 `sourceB`가 모두 재처리됩니다.
* `outputB`가 isolating이면 `sourceA`만 재처리됩니다.

`sourceC`가 추가된 경우:
* `outputB`가 aggregating이면 `sourceC`와 `sourceB`가 모두 재처리됩니다.
* `outputB`가 isolating이면 `sourceC`만 재처리됩니다.

`sourceA`가 제거되면 아무것도 재처리할 필요가 없습니다.

`sourceB`가 제거되면 아무것도 재처리할 필요가 없습니다.

## 파일 dirtiness가 결정되는 방법

dirty 파일은 사용자가 직접 _변경_ 하거나 다른 dirty 파일의 영향을 간접적으로 _받은_ 파일입니다. KSP는
두 단계로 dirtiness를 전파합니다.
* _resolution tracing_을 통한 전파:
  유형 참조를 (암시적으로 또는 명시적으로) resolve하는 것은 한 파일에서 다른 파일로 이동하는 유일한 방법입니다.
  유형 참조가 프로세서에 의해 resolve되면 resolution 결과에 잠재적으로 영향을 줄 수 있는 변경 사항이 포함된 변경되거나 영향을 받는 파일은 해당 참조를 포함하는 파일에 영향을 미칩니다.
* _입출력 대응_에 의한 전파:
  소스 파일이 변경되거나 영향을 받으면 해당 파일과 일부 출력을 공유하는 다른 모든 소스 파일이 영향을 받습니다.

둘 다 전이적이며 두 번째는 동등 클래스를 형성합니다.

## 버그 보고

버그를 보고하려면 Gradle 속성 `ksp.incremental=true` 및 `ksp.incremental.log=true`를 설정하고 clean 빌드를 수행하세요.
이 빌드는 다음 두 개의 로그 파일을 생성합니다.

* `build/kspCaches/<source set>/logs/kspDirtySet.log`
* `build/kspCaches/<source set>/logs/kspSourceToOutputs.log`

그런 다음 연속적인 증분 빌드를 실행하여 다음 두 개의 추가 로그 파일을 생성할 수 있습니다.

* `build/kspCaches/<source set>/logs/kspDirtySetByDeps.log`
* `build/kspCaches/<source set>/logs/kspDirtySetByOutputs.log`

이러한 로그에는 소스 및 출력의 파일 이름과 빌드의 타임스탬프가 포함되어 있습니다.