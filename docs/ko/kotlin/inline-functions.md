[//]: # (title: 인라인 함수)

[고차 함수](lambdas.md)를 사용하면 몇 가지 런타임 페널티가 발생합니다. 각 함수는 객체이며, 클로저(closure)를 캡처합니다. 클로저는 함수의 본문에서 액세스할 수 있는 변수들의 범위입니다. 메모리 할당(함수 객체와 클래스 모두) 및 가상 호출(virtual call)은 런타임 오버헤드를 발생시킵니다.

하지만 많은 경우 람다 표현식을 인라이닝(inlining)하여 이러한 오버헤드를 제거할 수 있습니다. 아래에 나오는 함수들은 이러한 상황의 좋은 예입니다. `lock()` 함수는 호출 지점에서 쉽게 인라인될 수 있습니다. 다음 경우를 살펴보세요.

```kotlin
lock(l) { foo() }
```

컴파일러는 파라미터를 위한 함수 객체를 생성하고 호출을 발생시키는 대신, 다음과 같은 코드를 내보낼 수 있습니다.

```kotlin
l.lock()
try {
    foo()
} finally {
    l.unlock()
}
```

컴파일러가 이렇게 하도록 만들려면, `lock()` 함수를 `inline` 수식어로 표시하세요.

```kotlin
inline fun <T> lock(lock: Lock, body: () -> T): T { ... }
```

`inline` 수식어는 함수 자체와 함수에 전달되는 람다 모두에 영향을 미칩니다. 이들 모두 호출 지점으로 인라인됩니다.

인라이닝으로 인해 생성된 코드가 늘어날 수 있습니다. 하지만 합리적인 방식(큰 함수를 인라이닝하는 것을 피함)으로 사용한다면, 특히 루프 내부의 "메가모픽(megamorphic)" 호출 지점에서 성능상 이득을 얻을 수 있습니다.

## noinline

인라인 함수에 전달된 모든 람다가 인라인되는 것을 원하지 않는 경우, 일부 함수 파라미터에 `noinline` 수식어를 표시할 수 있습니다.

```kotlin
inline fun foo(inlined: () -> Unit, noinline notInlined: () -> Unit) { ... }
```

인라인 가능한 람다는 인라인 함수 내부에서만 호출되거나 인라인 가능한 인자로만 전달될 수 있습니다. 반면, `noinline` 람다는 필드에 저장하거나 다른 곳으로 전달하는 등 원하는 방식으로 조작할 수 있습니다.

> 인라인 함수에 인라인 가능한 함수 파라미터가 없고 [실체화된 타입 파라미터(reified type parameters)](#reified-type-parameters)도 없는 경우, 컴파일러는 경고를 발생시킵니다. 이러한 함수를 인라이닝하는 것은 이득이 될 가능성이 매우 낮기 때문입니다(인라이닝이 꼭 필요하다고 확신하는 경우 `@Suppress("NOTHING_TO_INLINE")` 어노테이션을 사용하여 경고를 무시할 수 있습니다).
>
{style="note"}

## 비로컬(Non-local) 점프 표현식

### Returns

Kotlin에서는 이름이 있는 함수나 익명 함수를 종료하기 위해 한정되지 않은(unqualified) 일반 `return`만 사용할 수 있습니다. 람다를 종료하려면 [레이블(label)](returns.md#return-to-labels)을 사용해야 합니다. 람다 내부에서는 일반 `return`을 사용하는 것이 금지되어 있는데, 이는 람다가 자신을 둘러싼 함수를 반환(`return`)시킬 수 없기 때문입니다.

```kotlin
fun ordinaryFunction(block: () -> Unit) {
    println("hi!")
}
//sampleStart
fun foo() {
    ordinaryFunction {
        return // 에러: 여기서 `foo`를 반환시킬 수 없습니다.
    }
}
//sampleEnd
fun main() {
    foo()
}
```
{kotlin-runnable="true" validate="false"}

하지만 람다가 전달되는 함수가 인라인된 경우, return 또한 인라인될 수 있습니다. 따라서 다음과 같은 코드가 허용됩니다.

```kotlin
inline fun inlined(block: () -> Unit) {
    println("hi!")
}
//sampleStart
fun foo() {
    inlined {
        return // OK: 람다가 인라인됨
    }
}
//sampleEnd
fun main() {
    foo()
}
```
{kotlin-runnable="true"}

이러한 반환(람다 안에 위치하지만, 둘러싼 함수를 종료함)을 *비로컬(non-local)* 반환이라고 합니다. 이러한 구조는 보통 인라인 함수가 감싸고 있는 루프에서 자주 발생합니다.

```kotlin
fun hasZeros(ints: List<Int>): Boolean {
    ints.forEach {
        if (it == 0) return true // hasZeros에서 반환됨
    }
    return false
}
```

일부 인라인 함수는 파라미터로 전달된 람다를 함수 본문에서 직접 호출하지 않고, 로컬 객체나 중첩된 함수와 같은 다른 실행 컨텍스트에서 호출할 수 있습니다. 그런 경우 람다 내에서 비로컬 제어 흐름이 허용되지 않습니다. 인라인 함수의 람다 파라미터가 비로컬 반환을 사용할 수 없음을 나타내려면, 람다 파라미터를 `crossinline` 수식어로 표시하세요.

```kotlin
inline fun f(crossinline body: () -> Unit) {
    val f = object: Runnable {
        override fun run() = body()
    }
    // ...
}
```

### Break 및 continue

비로컬 `return`과 유사하게, 루프를 감싸는 인라인 함수에 인자로 전달된 람다 내에서 `break`와 `continue` [점프 표현식](returns.md)을 사용할 수 있습니다.

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

## 실체화된 타입 파라미터 (Reified type parameters)

가끔 파라미터로 전달된 타입에 접근해야 할 때가 있습니다.

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

여기서는 트리를 따라 올라가며 리플렉션을 사용하여 노드가 특정 타입인지 확인합니다. 코드는 문제없이 작동하지만, 호출 지점이 그리 예쁘지 않습니다.

```kotlin
treeNode.findParentOfType(MyTreeNode::class.java)
```

더 좋은 해결책은 이 함수에 단순히 타입을 전달하는 것입니다. 다음과 같이 호출할 수 있습니다.

```kotlin
treeNode.findParentOfType<MyTreeNode>()
```

이를 가능하게 하기 위해, 인라인 함수는 *실체화된 타입 파라미터(reified type parameters)*를 지원하므로 다음과 같이 작성할 수 있습니다.

```kotlin
inline fun <reified T> TreeNode.findParentOfType(): T? {
    var p = parent
    while (p != null && p !is T) {
        p = p.parent
    }
    return p as T?
}
```

위의 코드는 타입 파라미터에 `reified` 수식어를 붙여서 함수 내부에서 일반 클래스처럼 접근할 수 있게 합니다. 함수가 인라인되므로 리플렉션이 필요 없으며, `!is`나 `as`와 같은 일반 연산자를 이제 사용할 수 있습니다. 또한 `myTree.findParentOfType<MyTreeNodeType>()`와 같이 위에서 보여준 방식대로 함수를 호출할 수 있습니다.

대부분의 경우 리플렉션이 필요하지 않겠지만, 실체화된 타입 파라미터와 함께 리플렉션을 사용할 수도 있습니다.

```kotlin
inline fun <reified T> membersOf() = T::class.members

fun main(s: Array<String>) {
    println(membersOf<StringBuilder>().joinToString("
"))
}
```

일반 함수(inline으로 표시되지 않은 함수)는 실체화된 파라미터를 가질 수 없습니다. 런타임 표현이 없는 타입(예: 실체화되지 않은 타입 파라미터나 `Nothing`과 같은 가상 타입)은 실체화된 타입 파라미터의 인자로 사용될 수 없습니다.

## 인라인 프로퍼티

`inline` 수식어는 [뒷받침하는 필드(backing fields)](properties.md#backing-fields)가 없는 프로퍼티의 접근자(accessor)에 사용할 수 있습니다. 개별 프로퍼티 접근자에 어노테이션을 달 수 있습니다.

```kotlin
val foo: Foo
    inline get() = Foo()

var bar: Bar
    get() = ...
    inline set(v) { ... }
```

프로퍼티 전체에 어노테이션을 달 수도 있으며, 이 경우 두 접근자 모두 `inline`으로 표시됩니다.

```kotlin
inline var bar: Bar
    get() = ...
    set(v) { ... }
```

호출 지점에서 인라인 접근자는 일반 인라인 함수와 동일하게 인라인됩니다.

## 공개 API 인라인 함수에 대한 제한 사항

인라인 함수가 `public` 또는 `protected`이지만 `private` 또는 `internal` 선언의 일부가 아닌 경우, 이는 [모듈](visibility-modifiers.md#modules)의 공개 API로 간주됩니다. 이는 다른 모듈에서 호출될 수 있으며 해당 호출 지점에서도 인라인됩니다.

이로 인해 인라인 함수를 선언한 모듈이 변경되었을 때, 호출하는 모듈을 다시 컴파일하지 않을 경우 바이너리 호환성(binary incompatibility) 문제가 발생할 위험이 있습니다.

모듈의 *비공개* API 변경으로 인해 이러한 호환성 문제가 발생하는 것을 방지하기 위해, 공개 API 인라인 함수는 본문에서 비공개 API 선언(즉, `private` 및 `internal` 선언과 그 하위 항목들)을 사용할 수 없습니다.

`internal` 선언에 `@PublishedApi` 어노테이션을 달면 공개 API 인라인 함수에서 사용할 수 있게 됩니다. `internal` 인라인 함수가 `@PublishedApi`로 표시되면, 해당 본문도 공개된 것처럼 검사됩니다.