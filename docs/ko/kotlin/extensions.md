[//]: # (title: 확장)

코틀린은 클래스 상속이나 _데코레이터(Decorator)_와 같은 디자인 패턴을 사용하지 않고도 클래스나 인터페이스에 새로운 기능을 추가할 수 있는 기능을 제공합니다. 이는 _확장(extensions)_이라 불리는 특별한 선언을 통해 이루어집니다.

예를 들어, 수정할 수 없는 서드파티 라이브러리의 클래스나 인터페이스에 새로운 함수를 작성할 수 있습니다. 이러한 함수는 마치 원본 클래스의 메서드인 것처럼 일반적인 방식으로 호출될 수 있습니다. 이 메커니즘을 _확장 함수(extension function)_라고 합니다. 기존 클래스에 새로운 프로퍼티를 정의할 수 있는 _확장 프로퍼티(extension property)_도 있습니다.

## 확장 함수

확장 함수를 선언하려면 함수 이름 앞에 확장될 타입을 나타내는 _리시버 타입(receiver type)_을 접두사로 붙여야 합니다. 다음은 `MutableList<Int>`에 `swap` 함수를 추가하는 예시입니다:

```kotlin
fun MutableList<Int>.swap(index1: Int, index2: Int) {
    val tmp = this[index1] // 'this'는 리스트에 해당합니다.
    this[index1] = this[index2]
    this[index2] = tmp
}
```

확장 함수 내부의 `this` 키워드는 리시버 객체(점(.) 앞에 전달되는 객체)에 해당합니다.
이제 어떤 `MutableList<Int>`에서도 해당 함수를 호출할 수 있습니다:

```kotlin
val list = mutableListOf(1, 2, 3)
list.swap(0, 2) // 'swap()' 내부의 'this'는 'list'의 값을 가집니다.
```

이 함수는 어떤 `MutableList<T>`에도 의미가 있으며, 제네릭으로 만들 수 있습니다:

```kotlin
fun <T> MutableList<T>.swap(index1: Int, index2: Int) {
    val tmp = this[index1] // 'this'는 리스트에 해당합니다.
    this[index1] = this[index2]
    this[index2] = tmp
}
```

리시버 타입 표현식에서 제네릭 타입 파라미터를 사용할 수 있도록 함수 이름 앞에 선언해야 합니다.
제네릭에 대한 자세한 내용은 [제네릭 함수](generics.md)를 참조하세요.

## 확장은 _정적으로_ 해석됩니다.

확장은 실제로 확장하는 클래스를 수정하지 않습니다. 확장을 정의함으로써 클래스에 새로운 멤버를 삽입하는 것이 아니라, 해당 타입의 변수에 점 표기법으로 새로운 함수를 호출할 수 있게 만드는 것일 뿐입니다.

확장 함수는 _정적으로(statically)_ 디스패치됩니다. 따라서 어떤 확장 함수가 호출될지는 리시버 타입에 따라 컴파일 시점에 이미 알려집니다. 예를 들어:

```kotlin
fun main() {
//sampleStart
    open class Shape
    class Rectangle: Shape()
    
    fun Shape.getName() = "Shape"
    fun Rectangle.getName() = "Rectangle"
    
    fun printClassName(s: Shape) {
        println(s.getName())
    }
    
    printClassName(Rectangle())
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

이 예시는 _Shape_를 출력하는데, 이는 호출된 확장 함수가 파라미터 `s`의 선언된 타입(즉, `Shape` 클래스)에만 의존하기 때문입니다.

클래스에 멤버 함수가 있고, 동일한 리시버 타입, 동일한 이름, 그리고 주어진 인수에 적용 가능한 확장 함수가 정의되어 있다면, _멤버가 항상 우선합니다_. 예를 들어:

```kotlin
fun main() {
//sampleStart
    class Example {
        fun printFunctionType() { println("Class method") }
    }
    
    fun Example.printFunctionType() { println("Extension function") }
    
    Example().printFunctionType()
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

이 코드는 _Class method_를 출력합니다.

그러나 확장 함수가 이름은 같지만 시그니처가 다른 멤버 함수를 오버로드하는 것은 전혀 문제가 없습니다:

```kotlin
fun main() {
//sampleStart
    class Example {
        fun printFunctionType() { println("Class method") }
    }
    
    fun Example.printFunctionType(i: Int) { println("Extension function #$i") }
    
    Example().printFunctionType(1)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

## 널 허용 리시버

확장은 널 허용 리시버 타입으로 정의될 수 있다는 점에 유의하세요. 이러한 확장은 객체 변수의 값이 null이더라도 호출될 수 있습니다. 리시버가 `null`이면 `this`도 `null`입니다. 따라서 널 허용 리시버 타입으로 확장을 정의할 때는 컴파일러 오류를 피하기 위해 함수 본문 내에서 `this == null` 검사를 수행하는 것을 권장합니다.

코틀린에서는 `null` 검사 없이 `toString()`을 호출할 수 있습니다. 검사가 이미 확장 함수 내에서 이루어지기 때문입니다:

```kotlin
fun Any?.toString(): String {
    if (this == null) return "null"
    // 널 검사 후, 'this'는 널 불가능 타입으로 자동 캐스트되므로, 아래의 toString()은
    // Any 클래스의 멤버 함수로 해석됩니다.
    return toString()
}
```

## 확장 프로퍼티

코틀린은 함수를 지원하는 것과 유사하게 확장 프로퍼티를 지원합니다:

```kotlin
val <T> List<T>.lastIndex: Int
    get() = size - 1
```

> 확장은 실제로 클래스에 멤버를 삽입하지 않으므로, 확장 프로퍼티가 [백킹 필드](properties.md#backing-fields)를 가질 수 있는 효율적인 방법이 없습니다. 이것이 _확장 프로퍼티에는 초기화 구문이 허용되지 않는 이유_입니다. 확장 프로퍼티의 동작은 게터/세터를 명시적으로 제공함으로써만 정의할 수 있습니다.
>
{style="note"}

예시:

```kotlin
val House.number = 1 // 오류: 확장 프로퍼티에는 초기화 구문이 허용되지 않습니다.
```

## 동반 객체 확장

클래스에 [동반 객체](object-declarations.md#companion-objects)가 정의되어 있다면, 동반 객체에 대한 확장 함수와 프로퍼티도 정의할 수 있습니다. 동반 객체의 일반 멤버와 마찬가지로, 클래스 이름만을 한정자로 사용하여 호출할 수 있습니다:

```kotlin
class MyClass {
    companion object { }  // "Companion"으로 불립니다.
}

fun MyClass.Companion.printCompanion() { println("companion") }

fun main() {
    MyClass.printCompanion()
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

## 확장의 스코프

대부분의 경우, 확장은 패키지 바로 아래의 최상위 수준에서 정의합니다:

```kotlin
package org.example.declarations

fun List<String>.getLongestString() { /*...*/ }
```

선언된 패키지 외부에서 확장을 사용하려면 호출 지점에서 임포트해야 합니다:

```kotlin
package org.example.usage

import org.example.declarations.getLongestString

fun main() {
    val list = listOf("red", "green", "blue")
    list.getLongestString()
}
```

자세한 내용은 [임포트](packages.md#imports)를 참조하세요.

## 멤버로 확장 선언하기

하나의 클래스 내부에 다른 클래스에 대한 확장을 선언할 수 있습니다. 이러한 확장 내부에는 여러 개의 _암시적 리시버(implicit receiver)_가 있습니다. 이는 한정자 없이 멤버에 접근할 수 있는 객체입니다. 확장이 선언된 클래스의 인스턴스를 _디스패치 리시버(dispatch receiver)_라고 하고, 확장 메서드의 리시버 타입 인스턴스를 _확장 리시버(extension receiver)_라고 합니다.

```kotlin
class Host(val hostname: String) {
    fun printHostname() { print(hostname) }
}

class Connection(val host: Host, val port: Int) {
    fun printPort() { print(port) }

    fun Host.printConnectionString() {
        printHostname()   // Host.printHostname() 호출
        print(":")
        printPort()   // Connection.printPort() 호출
    }

    fun connect() {
        /*...*/
        host.printConnectionString()   // 확장 함수 호출
    }
}

fun main() {
    Connection(Host("kotl.in"), 443).connect()
    //Host("kotl.in").printConnectionString()  // 오류: Connection 외부에서는 확장 함수를 사용할 수 없습니다.
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

디스패치 리시버와 확장 리시버의 멤버 간에 이름 충돌이 발생하는 경우, 확장 리시버가 우선권을 가집니다. 디스패치 리시버의 멤버를 참조하려면 [한정된 `this` 구문](this-expressions.md#qualified-this)을 사용할 수 있습니다.

```kotlin
class Connection {
    fun Host.getConnectionString() {
        toString()         // Host.toString() 호출
        this@Connection.toString()  // Connection.toString() 호출
    }
}
```

멤버로 선언된 확장은 `open`으로 선언될 수 있으며 서브클래스에서 오버라이드될 수 있습니다. 이는 이러한 함수의 디스패치가 디스패치 리시버 타입에 대해서는 가상으로, 확장 리시버 타입에 대해서는 정적으로 이루어진다는 것을 의미합니다.

```kotlin
open class Base { }

class Derived : Base() { }

open class BaseCaller {
    open fun Base.printFunctionInfo() {
        println("Base extension function in BaseCaller")
    }

    open fun Derived.printFunctionInfo() {
        println("Derived extension function in BaseCaller")
    }

    fun call(b: Base) {
        b.printFunctionInfo()   // 확장 함수 호출
    }
}

class DerivedCaller: BaseCaller() {
    override fun Base.printFunctionInfo() {
        println("Base extension function in DerivedCaller")
    }

    override fun Derived.printFunctionInfo() {
        println("Derived extension function in DerivedCaller")
    }
}

fun main() {
    BaseCaller().call(Base())   // "Base extension function in BaseCaller"
    DerivedCaller().call(Base())  // "Base extension function in DerivedCaller" - 디스패치 리시버가 가상으로 해석됨
    DerivedCaller().call(Derived())  // "Base extension function in DerivedCaller" - 확장 리시버가 정적으로 해석됨
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

## 가시성 참고 사항

확장은 동일한 스코프에 선언된 일반 함수와 동일한 [가시성 변경자](visibility-modifiers.md)를 활용합니다.
예를 들어:

*   파일의 최상위에 선언된 확장은 동일 파일 내의 다른 `private` 최상위 선언에 접근할 수 있습니다.
*   확장이 리시버 타입 외부에서 선언된 경우, 리시버의 `private` 또는 `protected` 멤버에 접근할 수 없습니다.