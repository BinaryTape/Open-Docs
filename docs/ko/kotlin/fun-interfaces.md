---
title: "함수형 (SAM) 인터페이스"
---
단 하나의 추상 멤버 함수만 있는 인터페이스를 _함수형 인터페이스_ 또는 _SAM(Single Abstract Method) 인터페이스_라고 합니다. 함수형 인터페이스는 여러 개의 비추상 멤버 함수를 가질 수 있지만, 추상 멤버 함수는 하나만 가질 수 있습니다.

Kotlin에서 함수형 인터페이스를 선언하려면 `fun` modifier를 사용하세요.

```kotlin
fun interface KRunnable {
   fun invoke()
}
```

## SAM 변환

함수형 인터페이스의 경우, [람다 표현식](lambdas#lambda-expressions-and-anonymous-functions)을 사용하여 코드를 더 간결하고 읽기 쉽게 만들어주는 SAM 변환을 사용할 수 있습니다.

함수형 인터페이스를 수동으로 구현하는 클래스를 생성하는 대신 람다 표현식을 사용할 수 있습니다. SAM 변환을 사용하면 Kotlin은 인터페이스의 단일 메서드 시그니처와 일치하는 시그니처를 가진 람다 표현식을 코드로 변환하여 인터페이스 구현을 동적으로 인스턴스화할 수 있습니다.

예를 들어 다음 Kotlin 함수형 인터페이스를 고려해 보세요.

```kotlin
fun interface IntPredicate {
   fun accept(i: Int): Boolean
}
```

SAM 변환을 사용하지 않으면 다음과 같은 코드를 작성해야 합니다.

```kotlin
// Creating an instance of a class
val isEven = object : IntPredicate {
   override fun accept(i: Int): Boolean {
       return i % 2 == 0
   }
}
```

Kotlin의 SAM 변환을 활용하면 다음과 같은 동일한 코드를 대신 작성할 수 있습니다.

```kotlin
// Creating an instance using lambda
val isEven = IntPredicate { it % 2 == 0 }
```

짧은 람다 표현식이 불필요한 코드를 모두 대체합니다.

```kotlin
fun interface IntPredicate {
   fun accept(i: Int): Boolean
}

val isEven = IntPredicate { it % 2 == 0 }

fun main() {
   println("Is 7 even? - ${isEven.accept(7)}")
}
```

[Java 인터페이스에도 SAM 변환을 사용할 수 있습니다](java-interop#sam-conversions).

## 생성자 함수가 있는 인터페이스에서 함수형 인터페이스로 마이그레이션

1.6.20부터 Kotlin은 함수형 인터페이스 생성자에 대한 [callable references](reflection#callable-references)를 지원합니다. 이를 통해 생성자 함수가 있는 인터페이스에서 함수형 인터페이스로 소스 호환 방식으로 마이그레이션할 수 있습니다.
다음 코드를 고려해 보세요.

```kotlin
interface Printer { 
    fun print() 
}

fun Printer(block: () `->` Unit): Printer = object : Printer { override fun print() = block() }
```

함수형 인터페이스 생성자에 대한 callable references를 사용하면 이 코드를 함수형 인터페이스 선언으로 대체할 수 있습니다.

```kotlin
fun interface Printer { 
    fun print()
}
```

해당 생성자가 암시적으로 생성되고 `::Printer` 함수 참조를 사용하는 모든 코드가 컴파일됩니다. 예시:

```kotlin
documentsStorage.addPrinter(::Printer)
```

레거시 함수 `Printer`에 [`@Deprecated`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-deprecated/) annotation과 `DeprecationLevel.HIDDEN`을 함께 표시하여 이진 호환성을 유지합니다.

```kotlin
@Deprecated(message = "Your message about the deprecation", level = DeprecationLevel.HIDDEN)
fun Printer(...) {...}
```

## 함수형 인터페이스 vs. 타입 별칭

함수형 타입에 대한 [type alias](type-aliases)를 사용하여 위 내용을 간단하게 다시 작성할 수도 있습니다.

```kotlin
typealias IntPredicate = (i: Int) `->` Boolean

val isEven: IntPredicate = { it % 2 == 0 }

fun main() {
   println("Is 7 even? - ${isEven(7)}")
}
```

그러나 함수형 인터페이스와 [type aliases](type-aliases)는 서로 다른 용도로 사용됩니다.
타입 별칭은 기존 타입의 이름일 뿐이며 새 타입을 만들지 않지만 함수형 인터페이스는 새 타입을 만듭니다.
일반 함수 또는 해당 타입 별칭에는 적용할 수 없는 특정 함수형 인터페이스에 특정한 확장을 제공할 수 있습니다.

타입 별칭은 멤버를 하나만 가질 수 있지만 함수형 인터페이스는 여러 개의 비추상 멤버 함수와 하나의 추상 멤버 함수를 가질 수 있습니다.
함수형 인터페이스는 다른 인터페이스를 구현하고 확장할 수도 있습니다.

함수형 인터페이스는 타입 별칭보다 더 유연하고 더 많은 기능을 제공하지만 특정 인터페이스로의 변환이 필요할 수 있으므로 구문상 및 런타임 측면에서 더 많은 비용이 들 수 있습니다.
코드에서 어느 것을 사용할지 선택할 때는 요구 사항을 고려하세요.
* API가 특정 파라미터 및 반환 타입을 가진 함수(모든 함수)를 허용해야 하는 경우 간단한 함수형 타입을 사용하거나 타입 별칭을 정의하여 해당 함수형 타입에 더 짧은 이름을 지정하세요.
* API가 함수보다 더 복잡한 엔터티를 허용하는 경우(예: 함수형 타입의 시그니처로 표현할 수 없는 중요한 계약 및/또는 작업이 있는 경우) 별도의 함수형 인터페이스를 선언하세요.