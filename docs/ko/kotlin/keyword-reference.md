---
title: "키워드 및 연산자"
---
## 하드 키워드

다음 토큰은 항상 키워드로 해석되며 식별자로 사용할 수 없습니다.

 * `as`
     - [타입 캐스팅](typecasts#unsafe-cast-operator)에 사용됩니다.
     - [import에 대한 alias](packages#imports)를 지정합니다.
 * `as?`는 [안전한 타입 캐스팅](typecasts#safe-nullable-cast-operator)에 사용됩니다.
 * `break`는 [루프 실행을 종료합니다](returns).
 * `class`는 [클래스](classes)를 선언합니다.
 * `continue`는 [가장 가까운 둘러싸는 루프의 다음 단계로 진행합니다](returns).
 * `do`는 [do/while 루프](control-flow#while-loops)(사후 조건 루프)를 시작합니다.
 * `else`는 조건이 false일 때 실행되는 [if 표현식](control-flow#if-expression)의 분기를 정의합니다.
 * `false`는 [Boolean 타입](booleans)의 'false' 값을 지정합니다.
 * `for`는 [for 루프](control-flow#for-loops)를 시작합니다.
 * `fun`은 [함수](functions)를 선언합니다.
 * `if`는 [if 표현식](control-flow#if-expression)을 시작합니다.
 * `in`
     - [for 루프](control-flow#for-loops)에서 반복되는 객체를 지정합니다.
     - 값이 [범위](ranges), 컬렉션 또는 ['contains' 메서드를 정의하는 다른 엔티티](operator-overloading#in-operator)에 속하는지 확인하는 infix 연산자로 사용됩니다.
     - 동일한 목적으로 [when 표현식](control-flow#when-expressions-and-statements)에서 사용됩니다.
     - 타입 파라미터를 [반공변성](generics#declaration-site-variance)으로 표시합니다.
 * `!in`
     - 값이 [범위](ranges), 컬렉션 또는 ['contains' 메서드를 정의하는 다른 엔티티](operator-overloading#in-operator)에 속하지 않는지 확인하는 연산자로 사용됩니다.
     - 동일한 목적으로 [when 표현식](control-flow#when-expressions-and-statements)에서 사용됩니다.
 * `interface`는 [인터페이스](interfaces)를 선언합니다.
 * `is`
     - [값이 특정 타입을 가지는지 확인합니다](typecasts#is-and-is-operators).
     - 동일한 목적으로 [when 표현식](control-flow#when-expressions-and-statements)에서 사용됩니다.
 * `!is`
     - [값이 특정 타입을 가지지 않는지 확인합니다](typecasts#is-and-is-operators).
     - 동일한 목적으로 [when 표현식](control-flow#when-expressions-and-statements)에서 사용됩니다.
 * `null`은 어떤 객체도 가리키지 않는 객체 참조를 나타내는 상수입니다.
 * `object`는 [클래스와 해당 인스턴스를 동시에 선언합니다](object-declarations).
 * `package`는 [현재 파일의 package](packages)를 지정합니다.
 * `return`은 [가장 가까운 둘러싸는 함수 또는 익명 함수에서 반환합니다](returns).
 * `super`
     - [메서드 또는 프로퍼티의 슈퍼클래스 구현을 참조합니다](inheritance#calling-the-superclass-implementation).
     - [보조 생성자에서 슈퍼클래스 생성자를 호출합니다](classes#inheritance).
 * `this`
     - [현재 receiver를 참조합니다](this-expressions).
     - [보조 생성자에서 같은 클래스의 다른 생성자를 호출합니다](classes#constructors).
 * `throw`는 [예외를 발생시킵니다](exceptions).
 * `true`는 [Boolean 타입](booleans)의 'true' 값을 지정합니다.
 * `try`는 [예외 처리 블록을 시작합니다](exceptions).
 * `typealias`는 [타입 alias](type-aliases)를 선언합니다.
 * `typeof`는 향후 사용을 위해 예약되어 있습니다.
 * `val`은 읽기 전용 [프로퍼티](properties) 또는 [지역 변수](basic-syntax#variables)를 선언합니다.
 * `var`는 변경 가능한 [프로퍼티](properties) 또는 [지역 변수](basic-syntax#variables)를 선언합니다.
 * `when`은 [when 표현식](control-flow#when-expressions-and-statements)을 시작합니다 (주어진 분기 중 하나를 실행합니다).
 * `while`은 [while 루프](control-flow#while-loops)를 시작합니다 (사전 조건 루프).

## 소프트 키워드

다음 토큰은 해당 컨텍스트에서 키워드 역할을 하며 다른 컨텍스트에서는 식별자로 사용할 수 있습니다.

 * `by`
     - [인터페이스의 구현을 다른 객체에 위임합니다](delegation).
     - [프로퍼티에 대한 접근자의 구현을 다른 객체에 위임합니다](delegated-properties).
 * `catch`는 [특정 예외 타입을 처리하는](exceptions) 블록을 시작합니다.
 * `constructor`는 [기본 또는 보조 생성자](classes#constructors)를 선언합니다.
 * `delegate`는 [annotation 사용 위치 대상](annotations#annotation-use-site-targets)으로 사용됩니다.
 * `dynamic`은 Kotlin/JS 코드에서 [dynamic 타입](dynamic-type)을 참조합니다.
 * `field`는 [annotation 사용 위치 대상](annotations#annotation-use-site-targets)으로 사용됩니다.
 * `file`은 [annotation 사용 위치 대상](annotations#annotation-use-site-targets)으로 사용됩니다.
 * `finally`는 [try 블록이 종료될 때 항상 실행되는](exceptions) 블록을 시작합니다.
 * `get`
     - [프로퍼티의 getter](properties#getters-and-setters)를 선언합니다.
     - [annotation 사용 위치 대상](annotations#annotation-use-site-targets)으로 사용됩니다.
 * `import`는 [다른 package에서 선언을 현재 파일로 import합니다](packages).
 * `init`은 [초기화 블록](classes#constructors)을 시작합니다.
 * `param`은 [annotation 사용 위치 대상](annotations#annotation-use-site-targets)으로 사용됩니다.
 * `property`는 [annotation 사용 위치 대상](annotations#annotation-use-site-targets)으로 사용됩니다.
 * `receiver`는 [annotation 사용 위치 대상](annotations#annotation-use-site-targets)으로 사용됩니다.
 * `set`
     - [프로퍼티의 setter](properties#getters-and-setters)를 선언합니다.
     - [annotation 사용 위치 대상](annotations#annotation-use-site-targets)으로 사용됩니다.
* `setparam`은 [annotation 사용 위치 대상](annotations#annotation-use-site-targets)으로 사용됩니다.
* `value`는 `class` 키워드와 함께 [inline class](inline-classes)를 선언합니다.
* `where`는 [제네릭 타입 파라미터에 대한 제약 조건](generics#upper-bounds)을 지정합니다.

## 변경자 키워드

다음 토큰은 선언의 변경자 목록에서 키워드 역할을 하며 다른 컨텍스트에서는 식별자로 사용할 수 있습니다.

 * `abstract`는 클래스 또는 멤버를 [abstract](classes#abstract-classes)로 표시합니다.
 * `actual`은 [multiplatform 프로젝트](multiplatform-expect-actual)에서 플랫폼별 구현을 나타냅니다.
 * `annotation`은 [annotation 클래스](annotations)를 선언합니다.
 * `companion`은 [companion object](object-declarations#companion-objects)를 선언합니다.
 * `const`는 프로퍼티를 [컴파일 시간 상수](properties#compile-time-constants)로 표시합니다.
 * `crossinline`은 [inline 함수에 전달된 람다에서 non-local 반환을 금지합니다](inline-functions#returns).
 * `data`는 컴파일러에게 [클래스에 대한 정규 멤버를 생성하도록 지시합니다](data-classes).
 * `enum`은 [enumeration](enum-classes)을 선언합니다.
 * `expect`는 선언을 [플랫폼별](multiplatform-expect-actual)로 표시하고 플랫폼 모듈에서 구현을 기대합니다.
 * `external`은 선언이 Kotlin 외부에서 구현된 것으로 표시합니다 ([JNI](java-interop#using-jni-with-kotlin) 또는 [JavaScript](js-interop#external-modifier)를 통해 접근 가능).
 * `final`은 [멤버 재정의를 금지합니다](inheritance#overriding-methods).
 * `infix`는 [infix 표기법](functions#infix-notation)을 사용하여 함수를 호출할 수 있도록 합니다.
 * `inline`은 컴파일러에게 [함수와 호출 위치에서 전달된 람다를 inline하도록 지시합니다](inline-functions).
 * `inner`는 [nested 클래스](nested-classes)에서 외부 클래스 인스턴스를 참조할 수 있도록 합니다.
 * `internal`은 선언을 [현재 모듈에서 보이도록](visibility-modifiers) 표시합니다.
 * `lateinit`은 [생성자 외부에서 non-nullable 프로퍼티를 초기화할 수 있도록 합니다](properties#late-initialized-properties-and-variables).
 * `noinline`은 [inline 함수에 전달된 람다의 inlining을 끕니다](inline-functions#noinline).
 * `open`은 [클래스를 서브클래싱하거나 멤버를 재정의할 수 있도록 합니다](classes#inheritance).
 * `operator`는 함수를 [연산자 오버로딩 또는 규칙 구현으로 표시합니다](operator-overloading).
 * `out`은 타입 파라미터를 [공변성](generics#declaration-site-variance)으로 표시합니다.
 * `override`는 멤버를 [슈퍼클래스 멤버의 override로 표시합니다](inheritance#overriding-methods).
 * `private`는 선언을 [현재 클래스 또는 파일에서 보이도록](visibility-modifiers) 표시합니다.
 * `protected`는 선언을 [현재 클래스와 해당 서브클래스에서 보이도록](visibility-modifiers) 표시합니다.
 * `public`은 선언을 [어디서나 보이도록](visibility-modifiers) 표시합니다.
 * `reified`는 inline 함수의 타입 파라미터를 [런타임에 접근 가능하도록](inline-functions#reified-type-parameters) 표시합니다.
 * `sealed`는 [sealed 클래스](sealed-classes) (서브클래싱이 제한된 클래스)를 선언합니다.
 * `suspend`는 함수 또는 람다를 suspending으로 표시합니다 ([코루틴](coroutines-overview)으로 사용 가능).
 * `tailrec`는 함수를 [tail-recursive](functions#tail-recursive-functions)로 표시합니다 (컴파일러가 재귀를 반복으로 대체할 수 있도록 함).
 * `vararg`는 [파라미터에 가변 개수의 인수를 전달할 수 있도록 합니다](functions#variable-number-of-arguments-varargs).

## 특수 식별자

다음 식별자는 특정 컨텍스트에서 컴파일러에 의해 정의되며 다른 컨텍스트에서는 일반 식별자로 사용할 수 있습니다.

 * `field`는 프로퍼티 접근자 내에서 [프로퍼티의 backing field](properties#backing-fields)를 참조하는 데 사용됩니다.
 * `it`은 람다 내에서 [파라미터를 암시적으로 참조하는 데](lambdas#it-implicit-name-of-a-single-parameter) 사용됩니다.

## 연산자 및 특수 기호

Kotlin은 다음 연산자와 특수 기호를 지원합니다.

 * `+`, `-`, `*`, `/`, `%` - 수학 연산자
     - `*`는 [배열을 vararg 파라미터에 전달하는 데도 사용됩니다](functions#variable-number-of-arguments-varargs).
 * `=`
     - 할당 연산자.
     - [파라미터에 대한 기본 값](functions#default-arguments)을 지정하는 데 사용됩니다.
 * `+=`, `-=`, `*=`, `/=`, `%=` - [확장 할당 연산자](operator-overloading#augmented-assignments).
 * `++`, `--` - [증가 및 감소 연산자](operator-overloading#increments-and-decrements).
 * `&&`, `||`, `!` - 논리 'and', 'or', 'not' 연산자 (비트 연산의 경우 해당 [infix 함수](numbers#operations-on-numbers)를 대신 사용하십시오).
 * `==`, `!=` - [동등성 연산자](operator-overloading#equality-and-inequality-operators) (primitive 타입이 아닌 경우 `equals()` 호출로 변환됩니다).
 * `===`, `!==` - [참조 동등성 연산자](equality#referential-equality).
 * `<`, `>`, `<=`, `>=` - [비교 연산자](operator-overloading#comparison-operators) (primitive 타입이 아닌 경우 `compareTo()` 호출로 변환됩니다).
 * `[`, `]` - [인덱스 접근 연산자](operator-overloading#indexed-access-operator) (`get` 및 `set` 호출로 변환됩니다).
 * `!!` [표현식이 non-nullable임을 단언합니다](null-safety#not-null-assertion-operator).
 * `?.` [safe call](null-safety#safe-call-operator)을 수행합니다 (receiver가 non-nullable인 경우 메서드를 호출하거나 프로퍼티에 접근합니다).
 * `?:` 왼쪽 값이 null이면 오른쪽 값을 취합니다 ([elvis 연산자](null-safety#elvis-operator)).
 * `::` [멤버 참조](reflection#function-references) 또는 [클래스 참조](reflection#class-references)를 생성합니다.
 * `..`, `..<` [범위](ranges)를 생성합니다.
 * `:` 선언에서 이름과 타입을 분리합니다.
 * `?` 타입을 [nullable](null-safety#nullable-types-and-non-nullable-types)로 표시합니다.
 * `->`
     - [람다 표현식](lambdas#lambda-expression-syntax)의 파라미터와 body를 분리합니다.
     - [함수 타입](lambdas#function-types)에서 파라미터와 반환 타입 선언을 분리합니다.
     - [when 표현식](control-flow#when-expressions-and-statements) 분기의 조건과 body를 분리합니다.
 * `@`
     - [annotation](annotations#usage)을 도입합니다.
     - [루프 레이블](returns#break-and-continue-labels)을 도입하거나 참조합니다.
     - [람다 레이블](returns#return-to-labels)을 도입하거나 참조합니다.
     - ['this' 표현식을 외부 스코프에서 참조합니다](this-expressions#qualified-this).
     - [외부 슈퍼클래스](inheritance#calling-the-superclass-implementation)를 참조합니다.
 * `;` 같은 줄에 여러 문을 분리합니다.
 * `` `references a variable or expression in a [string template](strings#string-templates).
 * `_`
     - [람다 표현식](lambdas#underscore-for-unused-variables)에서 사용되지 않는 파라미터를 대체합니다.
     - [구조 분해 선언](destructuring-declarations#underscore-for-unused-variables)에서 사용되지 않는 파라미터를 대체합니다.

연산자 우선 순위에 대해서는 Kotlin 문법에서 [이 참조](https://kotlinlang.org/docs/reference/grammar.html#expressions)를 참조하십시오.