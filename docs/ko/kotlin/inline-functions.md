[//]: # (title: 인라인 함수)

[고차 함수](lambdas.md)를 사용하면 특정 런타임 오버헤드가 발생합니다. 각 함수는 객체이며 클로저를 캡처합니다. 클로저는 함수 본문에서 접근할 수 있는 변수 스코프입니다. (함수 객체와 클래스 모두에 대한) 메모리 할당 및 가상 호출은 런타임 오버헤드를 유발합니다.

하지만 많은 경우 이러한 종류의 오버헤드는 람다 표현식을 인라인화하여 제거할 수 있습니다. 아래에 표시된 함수들은 이러한 상황의 좋은 예시입니다. `lock()` 함수는 호출 지점에서 쉽게 인라인될 수 있습니다. 다음 경우를 고려해 보세요:

```kotlin
lock(l) { foo() }
```

파라미터에 대한 함수 객체를 생성하고 호출을 발생시키는 대신, 컴파일러는 다음 코드를 생성할 수 있습니다:

```kotlin
l.lock()
try {
    foo()
} finally {
    l.unlock()
}
```

컴파일러가 이를 수행하도록 하려면, `lock()` 함수에 `inline` 수식어를 붙이세요:

```kotlin
inline fun <T> lock(lock: Lock, body: () -> T): T { ... }
```

`inline` 수식어는 함수 자체와 함수에 전달되는 람다 모두에 영향을 미칩니다. 이 모든 것들이 호출 지점에 인라인됩니다.

인라인화는 생성된 코드의 크기를 증가시킬 수 있습니다. 하지만 합리적인 방식으로(큰 함수를 인라인화하는 것을 피하면서) 사용하면 특히 루프 내의 "메가모픽" 호출 지점에서 성능 향상에 기여할 것입니다.

## noinline

인라인 함수에 전달되는 모든 람다가 인라인되는 것을 원하지 않는다면, 일부 함수 파라미터에 `noinline` 수식어를 붙이세요:

```kotlin
inline fun foo(inlined: () -> Unit, noinline notInlined: () -> Unit) { ... }
```

인라인 가능한 람다는 인라인 함수 내부에서만 호출되거나 인라인 가능한 인수로 전달될 수 있습니다. 그러나 `noinline` 람다는 필드에 저장되거나 여기저기 전달되는 등 원하는 방식으로 조작될 수 있습니다.

> 인라인 함수에 인라인 가능한 함수 파라미터가 없거나
> [실체화된 타입 파라미터](#reified-type-parameters)가 없다면, 컴파일러는 그러한 함수의 인라인화가 거의 유익하지 않기 때문에 경고를 발생시킵니다 (인라인화가 필요하다고 확신한다면 `@Suppress("NOTHING_TO_INLINE")` 어노테이션을 사용하여 경고를 억제할 수 있습니다).
>
{style="note"}

## 비지역 점프 표현식

### 반환

Kotlin에서는 이름 있는 함수나 익명 함수를 종료하기 위해 일반적인 한정자 없는 `return`만 사용할 수 있습니다. 람다를 종료하려면 [레이블](returns.md#return-to-labels)을 사용하세요. 람다 내부에서 그냥 `return`을 사용하는 것은 금지되어 있습니다. 람다는 둘러싸는 함수를 `return`시킬 수 없기 때문입니다:

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

하지만 람다가 전달되는 함수가 인라인되면, `return`도 인라인될 수 있습니다. 따라서 허용됩니다:

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

(람다 내에 있지만 둘러싸는 함수를 종료하는) 이러한 반환을 *비지역 반환*이라고 합니다. 이러한 구문은 인라인 함수가 종종 포함하는 루프에서 주로 발생합니다:

```kotlin
fun hasZeros(ints: List<Int>): Boolean {
    ints.forEach {
        if (it == 0) return true // returns from hasZeros
    }
    return false
}
```

일부 인라인 함수는 파라미터로 전달된 람다를 함수 본문에서 직접 호출하는 것이 아니라, 로컬 객체나 중첩 함수와 같은 다른 실행 컨텍스트에서 호출할 수 있다는 점에 유의하세요. 이러한 경우 람다에서는 비지역 제어 흐름이 허용되지 않습니다. 인라인 함수의 람다 파라미터가 비지역 반환을 사용할 수 없음을 나타내려면, 람다 파라미터에 `crossinline` 수식어를 붙이세요:

```kotlin
inline fun f(crossinline body: () -> Unit) {
    val f = object: Runnable {
        override fun run() = body()
    }
    // ...
}
```

### break 및 continue

비지역 `return`과 유사하게, 루프를 둘러싸는 인라인 함수에 인수로 전달된 람다에서 `break` 및 `continue` [점프 표현식](returns.md)을 적용할 수 있습니다:

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

## 실체화된 타입 파라미터

때로는 파라미터로 전달된 타입에 접근해야 할 때가 있습니다:

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

여기서 트리를 거슬러 올라가며 리플렉션을 사용하여 노드가 특정 타입을 가지고 있는지 확인합니다. 모두 괜찮지만, 호출 지점이 그리 깔끔하지 않습니다:

```kotlin
treeNode.findParentOfType(MyTreeNode::class.java)
```

더 나은 해결책은 이 함수에 타입을 단순히 전달하는 것입니다. 다음과 같이 호출할 수 있습니다:

```kotlin
treeNode.findParentOfType<MyTreeNode>()
```

이를 가능하게 하기 위해, 인라인 함수는 *실체화된 타입 파라미터*를 지원하므로 다음과 같이 작성할 수 있습니다:

```kotlin
inline fun <reified T> TreeNode.findParentOfType(): T? {
    var p = parent
    while (p != null && p !is T) {
        p = p.parent
    }
    return p as T?
}
```

위 코드는 `reified` 수식어로 타입 파라미터를 한정하여 마치 일반 클래스처럼 함수 내부에서 접근할 수 있도록 합니다. 함수가 인라인되므로 리플렉션이 필요 없으며, `!is` 및 `as`와 같은 일반 연산자를 사용할 수 있습니다. 또한 위에서 보여준 대로 `myTree.findParentOfType<MyTreeNodeType>()`와 같이 함수를 호출할 수 있습니다.

많은 경우 리플렉션이 필요하지 않을 수 있지만, 실체화된 타입 파라미터와 함께 여전히 사용할 수 있습니다:

```kotlin
inline fun <reified T> membersOf() = T::class.members

fun main(s: Array<String>) {
    println(membersOf<StringBuilder>().joinToString("
"))
}
```

(inline으로 표시되지 않은) 일반 함수는 실체화된 파라미터를 가질 수 없습니다. 런타임 표현이 없는 타입(예를 들어, 실체화되지 않은 타입 파라미터 또는 `Nothing`과 같은 가상 타입)은 실체화된 타입 파라미터의 인수로 사용될 수 없습니다.

## 인라인 프로퍼티

`inline` 수식어는 [지원 필드](properties.md#backing-fields)가 없는 프로퍼티의 접근자(accessor)에 사용될 수 있습니다. 개별 프로퍼티 접근자에 어노테이션을 붙일 수 있습니다:

```kotlin
val foo: Foo
    inline get() = Foo()

var bar: Bar
    get() = ...
    inline set(v) { ... }
```

또한 전체 프로퍼티에 어노테이션을 붙여 해당 프로퍼티의 두 접근자 모두를 `inline`으로 표시할 수 있습니다:

```kotlin
inline var bar: Bar
    get() = ...
    set(v) { ... }
```

호출 지점에서 인라인 접근자는 일반 인라인 함수처럼 인라인됩니다.

## 공개 API 인라인 함수의 제약 사항

인라인 함수가 `public` 또는 `protected`이지만 `private` 또는 `internal` 선언의 일부가 아닌 경우, 해당 함수는 [모듈](visibility-modifiers.md#modules)의 공개 API로 간주됩니다. 다른 모듈에서 호출될 수 있으며, 해당 호출 지점에서도 인라인됩니다.

이는 인라인 함수를 선언하는 모듈의 변경으로 인해 호출하는 모듈이 변경 후 재컴파일되지 않았을 때 바이너리 호환성 문제의 특정 위험을 초래합니다.

모듈의 *비*공개 API 변경으로 인해 이러한 호환성 문제가 발생하는 위험을 제거하기 위해, 공개 API 인라인 함수는 비공개 API 선언, 즉 `private` 및 `internal` 선언 및 해당 선언의 부분을 본문에서 사용할 수 없습니다.

`internal` 선언은 `@PublishedApi` 어노테이션을 붙일 수 있으며, 이는 공개 API 인라인 함수에서 해당 선언의 사용을 허용합니다. `internal` 인라인 함수가 `@PublishedApi`로 표시되면, 마치 공개 함수인 것처럼 본문도 검사됩니다.