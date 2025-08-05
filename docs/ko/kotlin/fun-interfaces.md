[//]: # (title: 함수형 (SAM) 인터페이스)

추상 멤버 함수가 하나만 있는 인터페이스를 _함수형 인터페이스 (functional interface)_ 또는 _단일 추상 메서드(SAM) 인터페이스 (Single Abstract Method (SAM) interface)_라고 합니다. 함수형 인터페이스는 여러 비추상 멤버 함수를 가질 수 있지만, 추상 멤버 함수는 하나만 가질 수 있습니다.

Kotlin에서 함수형 인터페이스를 선언하려면 `fun` 한정자를 사용합니다.

```kotlin
fun interface KRunnable {
   fun invoke()
}
```

## SAM 변환

함수형 인터페이스의 경우, [람다 식 (lambda expressions)](lambdas.md#lambda-expressions-and-anonymous-functions)을 사용하여 코드를 더 간결하고 읽기 쉽게 만들어주는 SAM 변환 (SAM conversions)을 사용할 수 있습니다.

함수형 인터페이스를 수동으로 구현하는 클래스를 만드는 대신, 람다 식을 사용할 수 있습니다. SAM 변환을 사용하면 Kotlin은 인터페이스의 단일 메서드 시그니처와 일치하는 모든 람다 식을 인터페이스 구현을 동적으로 인스턴스화하는 코드로 변환할 수 있습니다.

예를 들어, 다음 Kotlin 함수형 인터페이스를 고려해 보겠습니다.

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

Kotlin의 SAM 변환을 활용하면 대신 다음의 동등한 코드를 작성할 수 있습니다.

```kotlin
// Creating an instance using lambda
val isEven = IntPredicate { it % 2 == 0 }
```

짧은 람다 식이 모든 불필요한 코드를 대체합니다.

```kotlin
fun interface IntPredicate {
   fun accept(i: Int): Boolean
}

val isEven = IntPredicate { it % 2 == 0 }

fun main() {
   println("Is 7 even? - ${isEven.accept(7)}")
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.4"}

[Java 인터페이스를 위한 SAM 변환](java-interop.md#sam-conversions)도 사용할 수 있습니다.

## 생성자 함수가 있는 인터페이스에서 함수형 인터페이스로의 마이그레이션

1.6.20부터 Kotlin은 함수형 인터페이스 생성자 (functional interface constructors)에 대한 [호출 가능한 참조 (callable references)](reflection.md#callable-references)를 지원하며, 이는 생성자 함수가 있는 인터페이스에서 함수형 인터페이스로 마이그레이션하는 소스 호환 가능한 방법을 추가합니다. 다음 코드를 고려해 보세요.

```kotlin
interface Printer { 
    fun print() 
}

fun Printer(block: () -> Unit): Printer = object : Printer { override fun print() = block() }
```

함수형 인터페이스 생성자에 대한 호출 가능한 참조가 활성화되면 이 코드는 단순히 함수형 인터페이스 선언으로 대체될 수 있습니다.

```kotlin
fun interface Printer { 
    fun print()
}
```

해당 생성자는 암시적으로 생성되며, `::Printer` 함수 참조를 사용하는 모든 코드는 컴파일됩니다. 예를 들어:

```kotlin
documentsStorage.addPrinter(::Printer)
```

레거시 함수 `Printer`를 `DeprecationLevel.HIDDEN`을 가진 [`@Deprecated`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-deprecated/) 어노테이션으로 표시하여 바이너리 호환성을 유지하세요.

```kotlin
@Deprecated(message = "Your message about the deprecation", level = DeprecationLevel.HIDDEN)
fun Printer(...) {...}
```

## 함수형 인터페이스 vs. 타입 별칭

위 내용을 [타입 별칭 (type alias)](type-aliases.md)을 사용하여 함수형 타입 (functional type)으로 단순히 재작성할 수도 있습니다.

```kotlin
typealias IntPredicate = (i: Int) -> Boolean

val isEven: IntPredicate = { it % 2 == 0 }

fun main() {
   println("Is 7 even? - ${isEven(7)}")
}
```

하지만, 함수형 인터페이스와 [타입 별칭](type-aliases.md)은 다른 목적을 가집니다. 타입 별칭은 기존 타입의 이름일 뿐이며, 새로운 타입을 생성하지 않는 반면, 함수형 인터페이스는 새로운 타입을 생성합니다. 특정 함수형 인터페이스에만 적용되고 일반 함수 (plain functions)나 해당 타입 별칭에는 적용되지 않는 확장을 제공할 수 있습니다.

타입 별칭은 하나의 멤버만 가질 수 있지만, 함수형 인터페이스는 여러 비추상 멤버 함수와 하나의 추상 멤버 함수를 가질 수 있습니다. 함수형 인터페이스는 다른 인터페이스를 구현하고 확장할 수도 있습니다.

함수형 인터페이스는 타입 별칭보다 더 유연하고 많은 기능을 제공하지만, 특정 인터페이스로의 변환이 필요할 수 있기 때문에 구문적으로나 런타임 시에 더 많은 비용이 발생할 수 있습니다. 코드에서 어떤 것을 사용할지 선택할 때 다음 요구 사항을 고려하세요.
*   API가 특정 매개변수와 반환 타입을 가진 함수(어떤 함수든)를 받아야 한다면, 간단한 함수형 타입을 사용하거나 해당 함수형 타입에 더 짧은 이름을 부여하기 위해 타입 별칭을 정의하세요.
*   API가 함수보다 더 복잡한 엔티티를 받는 경우(예를 들어, 사소하지 않은 계약 및/또는 함수형 타입의 시그니처로 표현할 수 없는 연산을 포함하는 경우), 이를 위한 별도의 함수형 인터페이스를 선언하세요.