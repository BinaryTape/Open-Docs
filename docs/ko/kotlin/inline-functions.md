---
title: "Inline functions"
---
[고차 함수](lambdas)를 사용하면 특정한 런타임 패널티가 발생합니다. 각 함수가 객체이고, 클로저를 캡처하기 때문입니다. 클로저는 함수의 본문에서 접근할 수 있는 변수의 범위입니다. 메모리 할당(함수 객체 및 클래스 모두)과 가상 호출은 런타임 오버헤드를 발생시킵니다.

그러나 많은 경우에 이러한 종류의 오버헤드는 람다 표현식을 인라인 처리함으로써 제거될 수 있는 것으로 보입니다. 아래에 표시된 함수는 이러한 상황의 좋은 예입니다. `lock()` 함수는 호출 지점에서 쉽게 인라인 처리될 수 있습니다. 다음 경우를 고려해 보겠습니다.

```kotlin
lock(l) { foo() }
```

컴파일러는 파라미터에 대한 함수 객체를 생성하고 호출을 생성하는 대신 다음 코드를 내보낼 수 있습니다.

```kotlin
l.lock()
try {
    foo()
} finally {
    l.unlock()
}
```

컴파일러가 이 작업을 수행하도록 하려면 `inline` 수정자로 `lock()` 함수를 표시합니다.

```kotlin
inline fun <T> lock(lock: Lock, body: () `->` T): T { ... }
```

`inline` 수정자는 함수 자체와 함수에 전달된 람다 모두에 영향을 미칩니다. 이러한 모든 항목이 호출 지점에 인라인 처리됩니다.

인라인 처리는 생성된 코드를 증가시킬 수 있습니다. 그러나 합리적인 방법으로 수행하면(큰 함수를 인라인 처리하지 않음), 특히 루프 내부의 "메가모픽(megamorphic)" 호출 지점에서 성능이 향상됩니다.

## noinline

인라인 함수에 전달된 모든 람다가 인라인 처리되기를 원하지 않는 경우, 함수 파라미터 중 일부를 `noinline` 수정자로 표시합니다.

```kotlin
inline fun foo(inlined: () `->` Unit, noinline notInlined: () `->` Unit) { ... }
```

인라인 처리 가능한 람다는 인라인 함수 내부에서만 호출되거나 인라인 처리 가능한 인수로 전달될 수 있습니다. 그러나 `noinline` 람다는 필드에 저장하거나 전달하는 것을 포함하여 원하는 방식으로 조작할 수 있습니다.

:::note
인라인 함수에 인라인 처리 가능한 함수 파라미터와 [구체화된 타입 파라미터](#reified-type-parameters)가 모두 없는 경우, 컴파일러는 경고를 표시합니다. 이러한 함수의 인라인 처리는 이점이 없을 가능성이 매우 높기 때문입니다. (`@Suppress("NOTHING_TO_INLINE")` 어노테이션을 사용하여 인라인 처리가 필요한 경우 경고를 표시하지 않도록 할 수 있습니다.)

:::

## 비-로컬 점프 표현식

### Returns

Kotlin에서는 이름이 지정된 함수 또는 익명 함수를 종료하기 위해 일반적인, 자격이 없는 `return`만 사용할 수 있습니다. 람다를 종료하려면 [레이블](returns#return-to-labels)을 사용합니다. 람다는 둘러싸는 함수를 `return`할 수 없기 때문에 람다 내부에서는 일반적인 `return`이 금지됩니다.

```kotlin
fun ordinaryFunction(block: () `->` Unit) {
    println("hi!")
}

fun foo() {
    ordinaryFunction {
        return // ERROR: cannot make `foo` return here
    }
}

fun main() {
    foo()
}
```

그러나 람다가 전달된 함수가 인라인 처리된 경우, return도 인라인 처리될 수 있습니다. 따라서 허용됩니다.

```kotlin
inline fun inlined(block: () `->` Unit) {
    println("hi!")
}

fun foo() {
    inlined {
        return // OK: the lambda is inlined
    }
}

fun main() {
    foo()
}
```

이러한 반환(람다에 위치하지만 둘러싸는 함수를 종료함)을 *비-로컬* 반환이라고 합니다. 이러한 종류의 구조는 일반적으로 루프에서 발생하며, 인라인 함수는 종종 이를 둘러쌉니다.

```kotlin
fun hasZeros(ints: List<Int>): Boolean {
    ints.forEach {
        if (it == 0) return true // returns from hasZeros
    }
    return false
}
```

일부 인라인 함수는 파라미터로 전달된 람다를 함수 본문에서 직접 호출하지 않고 로컬 객체 또는 중첩된 함수와 같은 다른 실행 컨텍스트에서 호출할 수 있습니다. 이러한 경우, 비-로컬 제어 흐름도 람다에서 허용되지 않습니다. 인라인 함수의 람다 파라미터가 비-로컬 반환을 사용할 수 없음을 나타내려면, `crossinline` 수정자로 람다 파라미터를 표시합니다.

```kotlin
inline fun f(crossinline body: () `->` Unit) {
    val f = object: Runnable {
        override fun run() = body()
    }
    // ...
}
```

### Break and continue

:::caution
이 기능은 현재 [미리 보기](kotlin-evolution-principles#pre-stable-features) 중입니다.
향후 릴리스에서 안정화할 계획입니다.
옵트인하려면 `-Xnon-local-break-continue` 컴파일러 옵션을 사용하십시오.
[YouTrack](https://youtrack.jetbrains.com/issue/KT-1436)에서 여러분의 피드백을 기다립니다.

:::

비-로컬 `return`과 유사하게, 루프를 둘러싸는 인라인 함수에 인수로 전달된 람다에서 `break` 및 `continue` [점프 표현식](returns)을 적용할 수 있습니다.

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

## 구체화된 타입 파라미터

경우에 따라 파라미터로 전달된 타입에 접근해야 할 수 있습니다.

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

여기서는 트리를 따라 올라가면서 리플렉션을 사용하여 노드가 특정 타입을 갖는지 확인합니다.
모두 괜찮지만 호출 지점이 그다지 보기 좋지 않습니다.

```kotlin
treeNode.findParentOfType(MyTreeNode::class.java)
```

더 나은 해결책은 단순히 이 함수에 타입을 전달하는 것입니다. 다음과 같이 호출할 수 있습니다.

```kotlin
treeNode.findParentOfType<MyTreeNode>()
```

이를 활성화하기 위해 인라인 함수는 *구체화된 타입 파라미터*를 지원하므로 다음과 같이 작성할 수 있습니다.

```kotlin
inline fun <reified T> TreeNode.findParentOfType(): T? {
    var p = parent
    while (p != null && p !is T) {
        p = p.parent
    }
    return p as T?
}
```

위의 코드는 함수 내부에서 거의 일반 클래스처럼 접근할 수 있도록 `reified` 수정자로 타입 파라미터를 한정합니다. 함수가 인라인 처리되므로 리플렉션이 필요하지 않으며 `!is` 및 `as`와 같은 일반 연산자를 이제 사용할 수 있습니다. 또한 위와 같이 함수를 호출할 수 있습니다: `myTree.findParentOfType<MyTreeNodeType>()`.

대부분의 경우 리플렉션이 필요하지 않을 수 있지만, 구체화된 타입 파라미터와 함께 여전히 사용할 수 있습니다.

```kotlin
inline fun <reified T> membersOf() = T::class.members

fun main(s: Array<String>) {
    println(membersOf<StringBuilder>().joinToString("
"))
}
```

일반 함수(인라인으로 표시되지 않음)는 구체화된 파라미터를 가질 수 없습니다.
런타임 표현이 없는 타입(예: 구체화되지 않은 타입 파라미터 또는 `Nothing`과 같은 가상 타입)은 구체화된 타입 파라미터의 인수로 사용할 수 없습니다.

## 인라인 프로퍼티

`inline` 수정자는 [backing fields](properties#backing-fields)가 없는 프로퍼티의 접근자에 사용할 수 있습니다.
개별 프로퍼티 접근자에 어노테이션을 달 수 있습니다.

```kotlin
val foo: Foo
    inline get() = Foo()

var bar: Bar
    get() = ...
    inline set(v) { ... }
```

전체 프로퍼티에 어노테이션을 달 수도 있으며, 이는 두 접근자를 모두 `inline`으로 표시합니다.

```kotlin
inline var bar: Bar
    get() = ...
    set(v) { ... }
```

호출 지점에서 인라인 접근자는 일반 인라인 함수로 인라인 처리됩니다.

## Public API 인라인 함수에 대한 제한 사항

인라인 함수가 `public` 또는 `protected`이지만 `private` 또는 `internal` 선언의 일부가 아닌 경우, [모듈](visibility-modifiers#modules)의 public API로 간주됩니다. 다른 모듈에서 호출할 수 있으며 해당 호출 지점에서 인라인 처리됩니다.

이로 인해 인라인 함수를 선언하는 모듈의 변경으로 인해 호출 모듈이 변경 후에 다시 컴파일되지 않는 경우 바이너리 비호환성이 발생할 수 있는 특정 위험이 있습니다.

모듈의 *비*-public API의 변경으로 인해 이러한 비호환성이 발생할 위험을 제거하기 위해, public API 인라인 함수는 비-public-API 선언, 즉 `private` 및 `internal` 선언과 해당 부분을 본문에서 사용할 수 없습니다.

`internal` 선언은 `@PublishedApi`로 어노테이션을 달 수 있으며, public API 인라인 함수에서 사용할 수 있습니다. `internal` 인라인 함수가 `@PublishedApi`로 표시되면 해당 본문도 public인 것처럼 검사됩니다.