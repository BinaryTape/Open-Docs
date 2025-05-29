[//]: # (title: 인라인 함수)

[고차 함수](lambdas.md)를 사용하면 특정 런타임 오버헤드가 발생합니다. 각 함수는 객체이며 클로저를 캡처합니다. 클로저는 함수 본문에서 접근할 수 있는 변수 범위입니다. 함수 객체와 클래스 모두에 대한 메모리 할당 및 가상 호출은 런타임 오버헤드를 발생시킵니다.

하지만 많은 경우에 람다 표현식을 인라이닝(inlining)하여 이러한 종류의 오버헤드를 제거할 수 있습니다. 아래에 표시된 함수들은 이러한 상황의 좋은 예시입니다. `lock()` 함수는 호출 지점에서 쉽게 인라이닝될 수 있습니다. 다음 경우를 고려해 보세요.

```kotlin
lock(l) { foo() }
```

매개변수에 대한 함수 객체를 생성하고 호출을 생성하는 대신, 컴파일러는 다음 코드를 내보낼 수 있습니다.

```kotlin
l.lock()
try {
    foo()
} finally {
    l.unlock()
}
```

컴파일러가 이렇게 하도록 하려면, `lock()` 함수에 `inline` 한정자를 붙이세요.

```kotlin
inline fun <T> lock(lock: Lock, body: () -> T): T { ... }
```

`inline` 한정자는 함수 자체와 함수에 전달된 람다 모두에 영향을 미칩니다. 이들 모두 호출 지점에 인라인됩니다.

인라이닝은 생성된 코드가 커지게 할 수 있습니다. 하지만 합리적인 방식으로 (큰 함수를 인라이닝하는 것을 피하면서) 사용한다면, 특히 루프 내부의 "메가모픽(megamorphic)" 호출 지점에서 성능 면에서 이득이 될 것입니다.

## noinline

인라인 함수에 전달된 모든 람다가 인라인되는 것을 원하지 않는다면, 일부 함수 매개변수에 `noinline` 한정자를 붙이세요.

```kotlin
inline fun foo(inlined: () -> Unit, noinline notInlined: () -> Unit) { ... }
```

인라인 가능한 람다는 인라인 함수 내부에서만 호출되거나 인라인 가능한 인자로 전달될 수 있습니다. 하지만 `noinline` 람다는 필드에 저장되거나 여기저기 전달되는 것을 포함하여 원하는 방식으로 조작될 수 있습니다.

> 인라인 함수에 인라인 가능한 함수 매개변수나 [실체화된 타입 매개변수](#reified-type-parameters)가 없다면, 그러한 함수를 인라이닝하는 것은 거의 이득이 되지 않으므로 컴파일러가 경고를 발생시킵니다 (인라이닝이 필요하다고 확신한다면 `@Suppress("NOTHING_TO_INLINE")` 어노테이션을 사용하여 경고를 억제할 수 있습니다).
>
{style="note"}

## 비지역 점프 표현식

### 반환 (Returns)

Kotlin에서는 이름 있는 함수나 익명 함수를 종료할 때만 일반적이고 한정되지 않은 `return`을 사용할 수 있습니다. 람다를 종료하려면 [레이블](returns.md#return-to-labels)을 사용하세요. 람다는 둘러싸는 함수를 `return`하게 할 수 없으므로 람다 내부에서 단독 `return`은 금지됩니다.

```kotlin
fun ordinaryFunction(block: () -> Unit) {
    println("hi!")
}
//sampleStart
fun foo() {
    ordinaryFunction {
        return // ERROR: cannot make `foo` return here
    }
}
//sampleEnd
fun main() {
    foo()
}
```
{kotlin-runnable="true" validate="false"}

하지만 람다가 전달되는 함수가 인라인되면, `return` 또한 인라인될 수 있습니다. 따라서 이는 허용됩니다.

```kotlin
inline fun inlined(block: () -> Unit) {
    println("hi!")
}
//sampleStart
fun foo() {
    inlined {
        return // OK: the lambda is inlined
    }
}
//sampleEnd
fun main() {
    foo()
}
```
{kotlin-runnable="true"}

그러한 `return` (람다 안에 있지만, 둘러싸는 함수를 종료하는)은 *비지역(non-local)* 반환이라고 불립니다. 이러한 종류의 구문은 인라인 함수가 종종 둘러싸는 루프에서 주로 발생합니다.

```kotlin
fun hasZeros(ints: List<Int>): Boolean {
    ints.forEach {
        if (it == 0) return true // returns from hasZeros
    }
    return false
}
```

일부 인라인 함수는 매개변수로 전달된 람다를 함수 본문에서 직접 호출하는 것이 아니라, 로컬 객체나 중첩 함수와 같은 다른 실행 컨텍스트에서 호출할 수 있습니다. 이러한 경우, 람다에서는 비지역 제어 흐름 또한 허용되지 않습니다. 인라인 함수의 람다 매개변수가 비지역 반환을 사용할 수 없음을 나타내려면, 해당 람다 매개변수에 `crossinline` 한정자를 붙이세요.

```kotlin
inline fun f(crossinline body: () -> Unit) {
    val f = object: Runnable {
        override fun run() = body()
    }
    // ...
}
```

### Break 및 continue

> 이 기능은 현재 [프리뷰](kotlin-evolution-principles.md#pre-stable-features) 상태입니다.
> 향후 릴리스에서 안정화할 계획입니다.
> 이 기능을 사용하려면 `-Xnon-local-break-continue` 컴파일러 옵션을 사용하세요.
> [YouTrack](https://youtrack.jetbrains.com/issue/KT-1436)에 대한 피드백을 보내주시면 감사하겠습니다.
>
{style="warning"}

비지역 `return`과 유사하게, 루프를 둘러싸는 인라인 함수에 인자로 전달된 람다에서 `break` 및 `continue` [점프 표현식](returns.md)을 사용할 수 있습니다.

```kotlin
fun processList(elements: List<Int>): Boolean {
    for (element in elements) {
        val variable = element.nullableMethod() ?: run {
            log.warning("Element is null or invalid, continuing...")
            continue
        }
        if (variable == 0) return true
    }
    return false
}
```

## 실체화된 타입 매개변수

매개변수로 전달된 타입에 접근해야 할 때가 있습니다.

```kotlin
fun <T> TreeNode.findParentOfType(clazz: Class<T>): T? {
    var p = parent
    while (p != null && !clazz.isInstance(p)) {
        p = p.parent
    }
    @Suppress("UNCHECKED_CAST")
    return p as T?
}
```

여기서는 트리를 거슬러 올라가 리플렉션을 사용하여 노드가 특정 타입을 가지는지 확인합니다. 모든 것이 좋지만, 호출 지점이 그다지 깔끔하지 않습니다.

```kotlin
treeNode.findParentOfType(MyTreeNode::class.java)
```

더 나은 해결책은 이 함수에 타입을 단순히 전달하는 것입니다. 다음과 같이 호출할 수 있습니다.

```kotlin
treeNode.findParentOfType<MyTreeNode>()
```

이를 가능하게 하려면, 인라인 함수는 *실체화된 타입 매개변수*를 지원하므로 다음과 같이 작성할 수 있습니다.

```kotlin
inline fun <reified T> TreeNode.findParentOfType(): T? {
    var p = parent
    while (p != null && p !is T) {
        p = p.parent
    }
    return p as T?
}
```

위 코드는 타입 매개변수에 `reified` 한정자를 붙여 마치 일반 클래스인 것처럼 함수 내부에서 접근 가능하게 만듭니다. 함수가 인라인되었으므로 리플렉션이 필요 없으며, `!is` 및 `as`와 같은 일반 연산자를 이제 사용할 수 있습니다. 또한 위에서 보았듯이 `myTree.findParentOfType<MyTreeNodeType>()`와 같이 함수를 호출할 수 있습니다.

많은 경우에 리플렉션이 필요하지 않을 수 있지만, 실체화된 타입 매개변수와 함께 여전히 사용할 수 있습니다.

```kotlin
inline fun <reified T> membersOf() = T::class.members

fun main(s: Array<String>) {
    println(membersOf<StringBuilder>().joinToString("
"))
}
```

(인라인으로 표시되지 않은) 일반 함수는 실체화된 매개변수를 가질 수 없습니다. 런타임 표현이 없는 타입(예를 들어, 실체화되지 않은 타입 매개변수 또는 `Nothing`과 같은 가상의 타입)은 실체화된 타입 매개변수의 인자로 사용될 수 없습니다.

## 인라인 프로퍼티

`inline` 한정자는 [백킹 필드](properties.md#backing-fields)를 가지지 않는 프로퍼티의 접근자에 사용될 수 있습니다. 개별 프로퍼티 접근자에 어노테이션을 붙일 수 있습니다.

```kotlin
val foo: Foo
    inline get() = Foo()

var bar: Bar
    get() = ...
    inline set(v) { ... }
```

전체 프로퍼티에 어노테이션을 붙일 수도 있으며, 이는 해당 프로퍼티의 두 접근자 모두를 `inline`으로 표시합니다.

```kotlin
inline var bar: Bar
    get() = ...
    set(v) { ... }
```

호출 지점에서 인라인 접근자는 일반 인라인 함수처럼 인라인됩니다.

## Public API 인라인 함수의 제약 사항

인라인 함수가 `public` 또는 `protected`이지만 `private` 또는 `internal` 선언의 일부가 아닐 경우, 이는 [모듈](visibility-modifiers.md#modules)의 public API로 간주됩니다. 다른 모듈에서 호출될 수 있으며 그러한 호출 지점에서도 인라인됩니다.

이는 변경 후 호출하는 모듈이 다시 컴파일되지 않는 경우, 인라인 함수를 선언하는 모듈의 변경으로 인해 발생하는 특정 바이너리 비호환성 위험을 초래합니다.

모듈의 *비(non)*-public API 변경으로 인해 그러한 비호환성이 발생할 위험을 제거하기 위해, public API 인라인 함수는 본문에서 비-public-API 선언(즉, `private` 및 `internal` 선언 및 그 구성 요소)을 사용할 수 없습니다.

`internal` 선언은 `@PublishedApi`로 어노테이션될 수 있으며, 이는 public API 인라인 함수에서 사용을 허용합니다. `internal` 인라인 함수가 `@PublishedApi`로 표시되면, 본문도 public인 것처럼 검사됩니다.