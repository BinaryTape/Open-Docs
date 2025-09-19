[//]: # (title: 타입 별칭)

타입 별칭(Type alias)은 기존 타입에 대한 대체 이름을 제공합니다.
타입 이름이 너무 길면 더 짧은 다른 이름을 도입하여 대신 사용할 수 있습니다.

길고 복잡한 제네릭 타입을 줄이는 데 유용합니다.
예를 들어, 컬렉션 타입의 이름을 줄이는 것이 종종 편리합니다.

```kotlin
typealias NodeSet = Set<Network.Node>

typealias FileTable<K> = MutableMap<K, MutableList<File>>
```

함수 타입에 대해 다른 별칭을 제공할 수 있습니다.

```kotlin
typealias MyHandler = (Int, String, Any) -> Unit

typealias Predicate<T> = (T) -> Boolean
```

이너 클래스 및 중첩 클래스에 대해 새로운 이름을 가질 수 있습니다.

```kotlin
class A {
    inner class Inner
}
class B {
    inner class Inner
}

typealias AInner = A.Inner
typealias BInner = B.Inner
```

타입 별칭은 새로운 타입을 도입하지 않습니다.
이는 해당 기본 타입과 동일합니다.
코드에 `typealias Predicate<T>`를 추가하고 `Predicate<Int>`를 사용하면, Kotlin 컴파일러는 항상 이를 `(Int) -> Boolean`으로 확장합니다.
따라서 일반 함수 타입이 필요할 때마다 타입 별칭 변수를 전달할 수 있으며 그 반대도 마찬가지입니다.

```kotlin
typealias Predicate<T> = (T) -> Boolean

fun foo(p: Predicate<Int>) = p(42)

fun main() {
    val f: (Int) -> Boolean = { it > 0 }
    println(foo(f)) // prints "true"

    val p: Predicate<Int> = { it > 0 }
    println(listOf(1, -2).filter(p)) // prints "[1]"
}
```
{kotlin-runnable="true"}

## 중첩 타입 별칭

<primary-label ref="beta"/>

Kotlin에서는 타입 별칭을 다른 선언 내부에 정의할 수 있으며, 이때 외부 클래스의 타입 매개변수를 캡처하지 않아야 합니다.

```kotlin
class Dijkstra {
    typealias VisitedNodes = Set<Node>

    private fun step(visited: VisitedNodes, ...) = ...
}
```

캡처링이란 타입 별칭이 외부 클래스에 정의된 타입 매개변수를 참조하는 것을 의미합니다.

```kotlin
class Graph<Node> {
    // Node를 캡처하므로 올바르지 않음
    typealias Path = List<Node>
}
```

이 문제를 해결하려면 타입 매개변수를 직접 타입 별칭에 선언하세요.

```kotlin
class Graph<Node> {
    // Node가 타입 별칭 매개변수이므로 올바름
    typealias Path<Node> = List<Node>
}
```

중첩 타입 별칭은 캡슐화를 개선하고, 패키지 수준의 혼란을 줄이며, 내부 구현을 단순화하여 더 깔끔하고 유지보수하기 쉬운 코드를 가능하게 합니다.

### 중첩 타입 별칭 규칙

중첩 타입 별칭은 명확하고 일관된 동작을 보장하기 위해 특정 규칙을 따릅니다.

*   중첩 타입 별칭은 기존의 모든 타입 별칭 규칙을 따라야 합니다.
*   가시성 측면에서, 별칭은 참조되는 타입이 허용하는 것 이상으로 노출될 수 없습니다.
*   범위는 [중첩 클래스](nested-classes.md)와 동일합니다. 클래스 내부에 정의할 수 있으며, 오버라이드하지 않으므로 같은 이름을 가진 모든 상위 타입 별칭을 숨깁니다.
*   중첩 타입 별칭은 가시성을 제한하기 위해 `internal` 또는 `private`으로 표시될 수 있습니다.
*   중첩 타입 별칭은 Kotlin Multiplatform의 [`expect/actual` 선언](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-expect-actual.html)에서 지원되지 않습니다.

### 중첩 타입 별칭 활성화 방법

프로젝트에서 중첩 타입 별칭을 활성화하려면, 명령줄에서 다음 컴파일러 옵션을 사용하세요.

```bash
-Xnested-type-aliases
```

또는 Gradle 빌드 파일의 `compilerOptions {}` 블록에 추가하세요.

```kotlin
// build.gradle.kts
kotlin {
    compilerOptions {
        freeCompilerArgs.add("-Xnested-type-aliases")
    }
}