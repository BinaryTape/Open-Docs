[//]: # (title: this 표현식)

현재 _수신객체(receiver)_를 나타내기 위해 `this` 표현식을 사용합니다:

* [클래스](classes.md#inheritance)의 멤버에서 `this`는 해당 클래스의 현재 객체를 참조합니다.
* [확장 함수](extensions.md) 또는 [수신객체가 지정된 함수 리터럴](lambdas.md#function-literals-with-receiver)에서 `this`는 점(`.`)의 왼쪽에 전달된 _수신객체_ 파라미터를 나타냅니다.

만약 `this`에 한정자가 없다면, _가장 안쪽에서 둘러싸는 스코프(innermost enclosing scope)_를 참조합니다. 다른 스코프의 `this`를 참조하려면 _레이블 한정자(label qualifiers)_를 사용합니다:

## 한정된 this 

외부 스코프([클래스](classes.md), [확장 함수](extensions.md), 또는 레이블이 지정된 [수신객체가 지정된 함수 리터럴](lambdas.md#function-literals-with-receiver))의 `this`에 접근하려면 `this@label`을 사용합니다. 여기서 `@label`은 `this`가 가리키고자 하는 스코프의 [레이블](returns.md)입니다:

```kotlin
class A { // 암시적 레이블 @A
    inner class B { // 암시적 레이블 @B
        fun Int.foo() { // 암시적 레이블 @foo
            val a = this@A // A의 this
            val b = this@B // B의 this

            val c = this // foo()의 수신객체인 Int
            val c1 = this@foo // foo()의 수신객체인 Int

            val funLit = lambda@ fun String.() {
                val d = this // funLit의 수신객체인 String
            }

            val funLit2 = { s: String ->
                // 둘러싸는 람다 표현식에 수신객체가 없으므로
                // foo()의 수신객체를 가리킴
                val d1 = this
            }
        }
    }
}
```

## 암시적인 this

`this`에서 멤버 함수를 호출할 때 `this.` 한정자를 생략할 수 있습니다. 하지만 더 가까운 렉시컬 스코프(lexical scope)에 이름이 같은 다른 호출 가능한 요소(callable)가 있다면, 코틀린은 한정되지 않은 호출에 대해 멤버 함수 대신 해당 요소를 찾아 호출합니다. 멤버 함수를 명시적으로 호출하려면 `this.` 한정자를 사용하세요:

```kotlin
fun main() {
    class A {
        fun printLine() {
            println("Member function")
        }

        fun invokePrintLine() {
            fun printLine() {
                println("Local function")
            }
         
            printLine()
            // Local function
         
            this.printLine()
            // Member function
        }
    }

    A().invokePrintLine()
}
```
{kotlin-runnable="true"}