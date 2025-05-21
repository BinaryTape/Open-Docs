---
title: "확장 프로그램"
---
Kotlin은 클래스를 상속하거나 _Decorator_와 같은 디자인 패턴을 사용하지 않고도 클래스나 인터페이스에 새로운 기능을 추가할 수 있는 기능을 제공합니다. 이는 _확장(extensions)_이라는 특별한 선언을 통해 이루어집니다.

예를 들어, 수정할 수 없는 타사 라이브러리의 클래스나 인터페이스에 대한 새로운 함수를 작성할 수 있습니다. 이러한 함수는 마치 원래 클래스의 메서드인 것처럼 일반적인 방식으로 호출할 수 있습니다. 이러한 메커니즘을 _확장 함수(extension function)_라고 합니다. 또한 기존 클래스에 대한 새로운 속성을 정의할 수 있는 _확장 속성(extension properties)_도 있습니다.

## 확장 함수

확장 함수를 선언하려면 이름 앞에 확장할 유형을 나타내는 _수신 객체 유형(receiver type)_을 접두사로 붙입니다. 다음은 `MutableList<Int>`에 `swap` 함수를 추가하는 예제입니다.

```kotlin
fun MutableList<Int>.swap(index1: Int, index2: Int) {
    val tmp = this[index1] // 'this'는 리스트에 해당합니다.
    this[index1] = this[index2]
    this[index2] = tmp
}
```

확장 함수 내부의 `this` 키워드는 수신 객체(점 앞에 전달된 객체)에 해당합니다. 이제 모든 `MutableList<Int>`에 대해 이 함수를 호출할 수 있습니다.

```kotlin
val list = mutableListOf(1, 2, 3)
list.swap(0, 2) // 'swap()' 내부의 'this'는 'list'의 값을 가집니다.
```

이 함수는 모든 `MutableList<T>`에 적합하며, 제네릭하게 만들 수 있습니다.

```kotlin
fun <T> MutableList<T>.swap(index1: Int, index2: Int) {
    val tmp = this[index1] // 'this'는 리스트에 해당합니다.
    this[index1] = this[index2]
    this[index2] = tmp
}
```

수신 객체 유형 표현식에서 사용할 수 있도록 함수 이름 앞에 제네릭 유형 매개변수를 선언해야 합니다. 제네릭에 대한 자세한 내용은 [제네릭 함수(generic functions)](generics)를 참조하세요.

## 확장은 _정적으로_ 결정됩니다.

확장은 실제로 확장하는 클래스를 수정하지 않습니다. 확장을 정의함으로써 클래스에 새로운 멤버를 삽입하는 것이 아니라, 해당 유형의 변수에 대해 점 표기법으로 호출할 수 있는 새로운 함수를 만드는 것뿐입니다.

확장 함수는 _정적으로_ 디스패치됩니다. 따라서 호출되는 확장 함수는 컴파일 시간에 수신 객체 유형에 따라 이미 결정됩니다. 예를 들어:

```kotlin
fun main() {

    open class Shape
    class Rectangle: Shape()
    
    fun Shape.getName() = "Shape"
    fun Rectangle.getName() = "Rectangle"
    
    fun printClassName(s: Shape) {
        println(s.getName())
    }
    
    printClassName(Rectangle())

}
```

이 예제는 _Shape_를 출력합니다. 호출되는 확장 함수는 매개변수 `s`의 선언된 유형인 `Shape` 클래스에만 의존하기 때문입니다.

클래스에 멤버 함수가 있고, 동일한 수신 객체 유형, 동일한 이름, 그리고 주어진 인수에 적용 가능한 확장 함수가 정의된 경우, _멤버가 항상 우선합니다_. 예를 들어:

```kotlin
fun main() {

    class Example {
        fun printFunctionType() { println("Class method") }
    }
    
    fun Example.printFunctionType() { println("Extension function") }
    
    Example().printFunctionType()

}
```

이 코드는 _Class method_를 출력합니다.

그러나 확장 함수가 동일한 이름이지만 다른 시그니처를 가진 멤버 함수를 오버로드하는 것은 완전히 괜찮습니다.

```kotlin
fun main() {

    class Example {
        fun printFunctionType() { println("Class method") }
    }
    
    fun Example.printFunctionType(i: Int) { println("Extension function #$i") }
    
    Example().printFunctionType(1)

}
```

## Nullable 수신 객체

확장은 nullable 수신 객체 유형으로 정의할 수 있습니다. 이러한 확장은 값이 null인 경우에도 객체 변수에서 호출할 수 있습니다. 수신 객체가 `null`이면 `this`도 `null`입니다. 따라서 nullable 수신 객체 유형으로 확장을 정의할 때는 컴파일러 오류를 방지하기 위해 함수 본문 내에서 `this == null` 검사를 수행하는 것이 좋습니다.

Kotlin에서 `toString()`을 호출할 때 `null` 검사를 하지 않아도 됩니다. 검사가 이미 확장 함수 내부에서 발생하기 때문입니다.

```kotlin
fun Any?.toString(): String {
    if (this == null) return "null"
    // null 검사 후 'this'는 non-nullable 유형으로 자동 캐스팅되므로 아래의 toString()은
    // Any 클래스의 멤버 함수로 결정됩니다.
    return toString()
}
```

## 확장 속성

Kotlin은 함수와 마찬가지로 확장 속성을 지원합니다.

```kotlin
val <T> List<T>.lastIndex: Int
    get() = size - 1
```

:::note
확장은 실제로 클래스에 멤버를 삽입하지 않으므로 확장 속성이 [backing field](properties#backing-fields)를 갖는 효율적인 방법은 없습니다. 이러한 이유로 _확장 속성에 초기화가 허용되지 않습니다_. 해당 동작은 명시적으로 getter/setter를 제공해야만 정의할 수 있습니다.

:::

예제:

```kotlin
val House.number = 1 // 오류: 확장 속성에는 초기화가 허용되지 않습니다.
```

## Companion object 확장

클래스에 [companion object](object-declarations#companion-objects)가 정의되어 있는 경우, companion object에 대한 확장 함수 및 속성을 정의할 수도 있습니다. companion object의 일반 멤버와 마찬가지로 클래스 이름만 한정자로 사용하여 호출할 수 있습니다.

```kotlin
class MyClass {
    companion object { }  // "Companion"이라고 불립니다.
}

fun MyClass.Companion.printCompanion() { println("companion") }

fun main() {
    MyClass.printCompanion()
}
```

## 확장 범위

대부분의 경우 최상위 수준에서 패키지 바로 아래에 확장을 정의합니다.

```kotlin
package org.example.declarations

fun List<String>.getLongestString() { /*...*/}
```

선언된 패키지 외부에서 확장을 사용하려면 호출 사이트에서 가져옵니다.

```kotlin
package org.example.usage

import org.example.declarations.getLongestString

fun main() {
    val list = listOf("red", "green", "blue")
    list.getLongestString()
}
```

자세한 내용은 [Imports](packages#imports)를 참조하세요.

## 멤버로 확장 선언하기

한 클래스 내에서 다른 클래스에 대한 확장을 선언할 수 있습니다. 이러한 확장 내부에는 여러 개의 _암시적 수신 객체(implicit receivers)_가 있습니다. 즉, 한정자 없이도 멤버에 액세스할 수 있는 객체입니다. 확장이 선언된 클래스의 인스턴스를 _디스패치 수신 객체(dispatch receiver)_라고 하고, 확장 메서드의 수신 객체 유형의 인스턴스를 _확장 수신 객체(extension receiver)_라고 합니다.

```kotlin
class Host(val hostname: String) {
    fun printHostname() { print(hostname) }
}

class Connection(val host: Host, val port: Int) {
    fun printPort() { print(port) }

    fun Host.printConnectionString() {
        printHostname()   // Host.printHostname()을 호출합니다.
        print(":")
        printPort()   // Connection.printPort()를 호출합니다.
    }

    fun connect() {
        /*...*/
        host.printConnectionString()   // 확장 함수를 호출합니다.
    }
}

fun main() {
    Connection(Host("kotl.in"), 443).connect()
    //Host("kotl.in").printConnectionString()  // 오류, 확장 함수는 Connection 외부에서 사용할 수 없습니다.
}
```

디스패치 수신 객체의 멤버와 확장 수신 객체의 멤버 간에 이름 충돌이 발생하는 경우, 확장 수신 객체가 우선합니다. 디스패치 수신 객체의 멤버를 참조하려면 [정규화된 `this` 구문(qualified `this` syntax)](this-expressions#qualified-this)을 사용할 수 있습니다.

```kotlin
class Connection {
    fun Host.getConnectionString() {
        toString()         // Host.toString()을 호출합니다.
        this@Connection.toString()  // Connection.toString()을 호출합니다.
    }
}
```

멤버로 선언된 확장은 `open`으로 선언하고 하위 클래스에서 재정의할 수 있습니다. 이는 이러한 함수의 디스패치가 디스패치 수신 객체 유형에 대해서는 가상이지만 확장 수신 객체 유형에 대해서는 정적임을 의미합니다.

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
        b.printFunctionInfo()   // 확장 함수를 호출합니다.
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
    DerivedCaller().call(Base())  // "Base extension function in DerivedCaller" - 디스패치 수신 객체는 가상으로 결정됩니다.
    DerivedCaller().call(Derived())  // "Base extension function in DerivedCaller" - 확장 수신 객체는 정적으로 결정됩니다.
}
```

## 가시성에 대한 참고 사항

확장은 동일한 범위에서 선언된 일반 함수와 동일한 [가시성 수정자(visibility modifiers)](visibility-modifiers)를 사용합니다. 예를 들어:

* 파일의 최상위 수준에서 선언된 확장은 동일한 파일의 다른 `private` 최상위 수준 선언에 액세스할 수 있습니다.
* 확장이 수신 객체 유형 외부에서 선언된 경우 수신 객체의 `private` 또는 `protected` 멤버에 액세스할 수 없습니다.
```