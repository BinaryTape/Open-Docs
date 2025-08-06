[//]: # (title: Kotlin 코드 문서화: KDoc)

Kotlin 코드를 문서화하는 데 사용되는 언어(Java의 Javadoc에 해당)는 **KDoc**이라고 합니다. 본질적으로 KDoc은 Javadoc의 블록 태그 구문(Kotlin의 특정 구문 지원을 위해 확장됨)과 인라인 마크업을 위한 Markdown을 결합합니다.

> Kotlin의 문서화 엔진인 Dokka는 KDoc을 이해하며 다양한 형식의 문서를 생성하는 데 사용될 수 있습니다. 더 자세한 정보는 [Dokka 문서](dokka-introduction.md)를 참조하세요.
>
{style="note"}

## KDoc 구문

Javadoc과 마찬가지로 KDoc 주석은 `/**`로 시작하고 `*/`로 끝납니다. 주석의 각 줄은 별표로 시작할 수 있으며, 이 별표는 주석 내용의 일부로 간주되지 않습니다.

관례적으로 문서화 텍스트의 첫 번째 단락(첫 번째 빈 줄까지의 텍스트 블록)은 요소의 요약 설명이며, 이어지는 텍스트는 상세 설명입니다.

모든 블록 태그는 새 줄에서 시작하며 `@` 문자로 시작합니다.

다음은 KDoc을 사용하여 문서화된 클래스의 예시입니다:

```kotlin
/**
 * A group of *members*.
 *
 * This class has no useful logic; it's just a documentation example.
 *
 * @param T the type of a member in this group.
 * @property name the name of this group.
 * @constructor Creates an empty group.
 */
class Group<T>(val name: String) {
    /**
     * Adds a [member] to this group.
     * @return the new size of the group.
     */
    fun add(member: T): Int { ... }
}
```

### 블록 태그

KDoc은 현재 다음 블록 태그를 지원합니다:

### @param _name_

함수 또는 클래스, 프로퍼티, 함수의 타입 파라미터의 값 파라미터를 문서화합니다.
파라미터 이름을 설명과 더 잘 구분하기 위해, 원한다면 파라미터 이름을 대괄호로 묶을 수 있습니다. 따라서 다음 두 구문은 동일합니다:

```none
@param name description.
@param[name] description.
```

### @return

함수의 반환 값을 문서화합니다.

### @constructor

클래스의 주 생성자를 문서화합니다.

### @receiver

확장 함수의 리시버를 문서화합니다.

### @property _name_

지정된 이름을 가진 클래스의 프로퍼티를 문서화합니다. 이 태그는 주 생성자에 선언된 프로퍼티를 문서화하는 데 사용할 수 있습니다. 이 경우 프로퍼티 정의 바로 앞에 문서 주석을 두는 것은 어색할 수 있습니다.

### @throws _class_, @exception _class_

메서드가 던질 수 있는 예외를 문서화합니다. Kotlin은 체크드 예외(checked exceptions)를 가지고 있지 않으므로, 가능한 모든 예외가 문서화되어야 한다는 기대는 없지만, 클래스 사용자에게 유용한 정보를 제공할 때 이 태그를 여전히 사용할 수 있습니다.

### @sample _identifier_

지정된 정규화된 이름을 가진 함수의 본문을 현재 요소의 문서에 포함하여 요소가 어떻게 사용될 수 있는지 예시를 보여줍니다.

### @see _identifier_

지정된 클래스 또는 메서드에 대한 링크를 문서의 **참고 자료** 블록에 추가합니다.

### @author

문서화되는 요소의 작성자를 지정합니다.

### @since

문서화되는 요소가 도입된 소프트웨어 버전을 지정합니다.

### @suppress

요소를 생성된 문서에서 제외합니다. 모듈의 공식 API의 일부는 아니지만 외부적으로 여전히 표시되어야 하는 요소에 사용될 수 있습니다.

> KDoc은 `@deprecated` 태그를 지원하지 않습니다. 대신 [`@Deprecated`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin/-deprecated/) 어노테이션을 사용하십시오.
>
{style="note"}

## 인라인 마크업

인라인 마크업의 경우, KDoc은 코드의 다른 요소에 연결하기 위한 약식 구문을 지원하도록 확장된 일반 [Markdown](https://daringfireball.net/projects/markdown/syntax) 구문을 사용합니다.

### 요소 링크

다른 요소(클래스, 메서드, 프로퍼티 또는 파라미터)에 링크하려면, 단순히 이름을 대괄호 안에 넣으십시오:

```none
Use the method [foo] for this purpose.
```

링크에 사용자 지정 레이블을 지정하려면, 요소 링크 앞에 다른 대괄호 세트 안에 추가하십시오:

```none
Use [this method][foo] for this purpose.
```

요소 링크에서 정규화된 이름을 사용할 수도 있습니다. Javadoc과 달리 정규화된 이름은 메서드 이름 앞에서도 항상 점(.) 문자를 사용하여 구성 요소를 구분한다는 점에 유의하십시오:

```none
Use [kotlin.reflect.KClass.properties] to enumerate the properties of the class.
```

요소 링크의 이름은 문서화되는 요소 내부에서 이름이 사용된 것과 동일한 규칙을 사용하여 해결됩니다. 특히, 이는 현재 파일로 이름을 임포트한 경우 KDoc 주석에서 사용할 때 완전히 정규화할 필요가 없음을 의미합니다.

KDoc은 링크에서 오버로드된 멤버를 해결하기 위한 구문을 가지고 있지 않다는 점에 유의하십시오. Kotlin의 문서 생성 도구는 함수의 모든 오버로드에 대한 문서를 동일한 페이지에 배치하므로, 링크가 작동하기 위해 특정 오버로드된 함수를 식별할 필요는 없습니다.

### 외부 링크

외부 링크를 추가하려면 일반적인 Markdown 구문을 사용하십시오:

```none
For more information about KDoc syntax, see [KDoc](<example-URL>).
```

## 다음 단계는?

Kotlin의 문서 생성 도구인 [Dokka](dokka-introduction.md) 사용법을 알아보세요.