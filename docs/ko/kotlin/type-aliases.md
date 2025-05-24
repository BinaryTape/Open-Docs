---
title: "타입 별칭"
---
타입 별칭은 기존 타입에 대한 다른 이름을 제공합니다.
타입 이름이 너무 길면 더 짧은 다른 이름을 도입하고 대신 새 이름을 사용할 수 있습니다.
 
긴 제네릭 타입을 줄이는 데 유용합니다.
예를 들어 컬렉션 타입을 줄이는 것이 좋습니다.

```kotlin
typealias NodeSet = Set<Network.Node>

typealias FileTable<K> = MutableMap<K, MutableList<File>>
```

함수 타입에 대해 다른 별칭을 제공할 수 있습니다.

```kotlin
typealias MyHandler = (Int, String, Any) `->` Unit

typealias Predicate<T> = (T) `->` Boolean
```

내부 및 중첩 클래스에 대한 새 이름을 가질 수 있습니다.

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
해당 기본 타입과 동일합니다.
코드에서 `typealias Predicate<T>`를 추가하고 `Predicate<Int>`를 사용하면 Kotlin 컴파일러는 항상 `(Int) `->` Boolean`으로 확장합니다.
따라서 일반 함수 타입이 필요한 경우 언제든지 해당 타입의 변수를 전달할 수 있으며 그 반대의 경우도 마찬가지입니다.

```kotlin
typealias Predicate<T> = (T) `->` Boolean

fun foo(p: Predicate<Int>) = p(42)

fun main() {
    val f: (Int) `->` Boolean = { it > 0 }
    println(foo(f)) // prints "true"

    val p: Predicate<Int> = { it > 0 }
    println(listOf(1, -2).filter(p)) // prints "[1]"
}
```