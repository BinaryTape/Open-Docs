---
title: "This 표현식"
---
현재 _수신자_를 나타내려면 `this` 표현식을 사용합니다.

* [클래스](classes#inheritance)의 멤버에서 `this`는 해당 클래스의 현재 객체를 참조합니다.
* [확장 함수](extensions) 또는 [수신자가 있는 함수 리터럴](lambdas#function-literals-with-receiver)에서 `this`는 점의 왼쪽에 전달되는 _수신자_ 매개변수를 나타냅니다.

`this`에 한정자가 없으면 _가장 안쪽의 둘러싸는 스코프_를 참조합니다. 다른 스코프에서 `this`를 참조하려면 _레이블 한정자_를 사용합니다.

## Qualified this

외부 스코프([클래스](classes), [확장 함수](extensions) 또는 레이블이 지정된 [수신자가 있는 함수 리터럴](lambdas#function-literals-with-receiver))에서 `this`에 액세스하려면 `this@label`을 작성합니다. 여기서 `@label`은 `this`가 가져오려는 스코프의 [레이블](returns)입니다.

```kotlin
class A { // implicit label @A
    inner class B { // implicit label @B
        fun Int.foo() { // implicit label @foo
            val a = this@A // A's this
            val b = this@B // B's this

            val c = this // foo()'s receiver, an Int
            val c1 = this@foo // foo()'s receiver, an Int

            val funLit = lambda@ fun String.() {
                val d = this // funLit's receiver, a String
            }

            val funLit2 = { s: String `->`
                // foo()'s receiver, since enclosing lambda expression
                // doesn't have any receiver
                val d1 = this
            }
        }
    }
}
```

## Implicit this

`this`에서 멤버 함수를 호출할 때 `this.` 부분을 생략할 수 있습니다. 이름이 같은 멤버가 아닌 함수가 있는 경우 경우에 따라 대신 호출될 수 있으므로 주의해서 사용하십시오.

```kotlin
fun main() {
    fun printLine() { println("Local function") }
    
    class A {
        fun printLine() { println("Member function") }

        fun invokePrintLine(omitThis: Boolean = false)  { 
            if (omitThis) printLine()
            else this.printLine()
        }
    }
    
    A().invokePrintLine() // Member function
    A().invokePrintLine(omitThis = true) // Local function
}
```