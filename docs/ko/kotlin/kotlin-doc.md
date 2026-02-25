[//]: # (title: Kotlin 코드 문서화: KDoc)

Kotlin 코드를 문서화하는 데 사용되는 언어(Java의 Javadoc에 해당)를 **KDoc**이라고 합니다. 기본적으로 KDoc은 (Kotlin의 특정 구조를 지원하도록 확장된) Javadoc의 블록 태그 구문과 인라인 마크업을 위한 Markdown을 결합한 것입니다.

> Kotlin의 문서화 엔진인 Dokka는 KDoc을 이해하며 다양한 형식의 문서를 생성하는 데 사용할 수 있습니다.
> 더 자세한 정보는 [Dokka 문서](dokka-introduction.md)를 참고하세요.
>
{style="note"}

## KDoc 구문

Javadoc과 마찬가지로 KDoc 주석은 `/**`로 시작해서 `*/`로 끝납니다. 주석의 모든 줄은 별표(`*`)로 시작할 수 있으며, 이 별표는 주석 내용의 일부로 간주되지 않습니다.

관례상, 문서화 텍스트의 첫 번째 단락(첫 번째 빈 줄이 나오기 전까지의 텍스트 블록)은 요소에 대한 요약 설명이며, 이어지는 텍스트는 상세 설명입니다.

모든 블록 태그는 새 줄에서 `@` 문자로 시작합니다.

다음은 KDoc을 사용하여 문서화한 클래스의 예입니다.

```kotlin
/**
 * *멤버*들의 그룹.
 *
 * 이 클래스는 유용한 로직을 포함하지 않습니다. 단지 문서화 예시일 뿐입니다.
 *
 * @param T 이 그룹에 속한 멤버의 타입.
 * @property name 이 그룹의 이름.
 * @constructor 빈 그룹을 생성합니다.
 */
class Group<T>(val name: String) {
    /**
     * 이 그룹에 [member]를 추가합니다.
     * @return 그룹의 새로운 크기.
     */
    fun add(member: T): Int { ... }
}
```

### 블록 태그

KDoc은 현재 다음과 같은 블록 태그를 지원합니다.

### @param _name_

함수의 값 매개변수(value parameter) 또는 클래스, 프로퍼티, 함수의 타입 매개변수(type parameter)를 문서화합니다.
원하는 경우 매개변수 이름을 설명과 더 잘 구분하기 위해 매개변수 이름을 대괄호로 묶을 수 있습니다. 따라서 다음 두 구문은 동일합니다.

```none
@param name description.
@param[name] description.
```

### @return

함수의 반환 값을 문서화합니다.

### @constructor

클래스의 주 생성자(primary constructor)를 문서화합니다.

### @receiver

확장 함수의 수신객체(receiver)를 문서화합니다.

### @property _name_

지정된 이름을 가진 클래스의 프로퍼티를 문서화합니다. 이 태그는 주 생성자에 선언된 프로퍼티를 문서화할 때 유용하며, 프로퍼티 정의 바로 앞에 문서 주석을 넣기 어색한 경우에 사용할 수 있습니다.

### @throws _class_, @exception _class_

메서드에서 발생할 수 있는 예외를 문서화합니다. Kotlin에는 체크 예외(checked exception)가 없으므로 발생 가능한 모든 예외를 문서화할 의무는 없지만, 클래스 사용자에게 유용한 정보를 제공할 때 이 태그를 사용할 수 있습니다.

### @sample _identifier_

현재 요소의 문서에 지정된 정규화된 이름(qualified name)을 가진 함수의 본문을 포함하여, 해당 요소의 사용 예시를 보여줍니다.

### @see _identifier_

문서의 **See also** 블록에 지정된 클래스나 메서드에 대한 링크를 추가합니다.

### @author

문서화 중인 요소의 작성자를 지정합니다.

### @since

문서화 중인 요소가 도입된 소프트웨어 버전을 지정합니다.

### @suppress

생성된 문서에서 해당 요소를 제외합니다. 모듈의 공식 API의 일부는 아니지만 외부에서 볼 수 있어야 하는 요소에 사용할 수 있습니다.

> KDoc은 `@deprecated` 태그를 지원하지 않습니다. 대신 [`@Deprecated`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin/-deprecated/) 어노테이션을 사용하세요.
>
{style="note"}

## 인라인 마크업

인라인 마크업을 위해 KDoc은 일반적인 [Markdown](https://daringfireball.net/projects/markdown/syntax) 구문을 사용하며, 코드 내의 다른 요소를 연결하기 위한 약식 구문을 지원하도록 확장되었습니다.

### 요소 링크

다른 요소(클래스, 메서드, 프로퍼티 또는 매개변수)로 링크하려면 해당 이름을 대괄호 안에 넣으세요.

```none
이 목적을 위해 [foo] 메서드를 사용하세요.
```

링크에 커스텀 레이블을 지정하고 싶다면, 요소 링크 앞의 다른 대괄호 세트에 레이블을 추가하세요.

```none
이 목적을 위해 [이 메서드][foo]를 사용하세요.
```

요소 링크에서 정규화된 이름(qualified name)을 사용할 수도 있습니다. Javadoc과 달리 정규화된 이름은 메서드 이름 앞이라도 항상 점(`.`) 문자를 사용하여 구성 요소를 구분합니다.

```none
클래스의 프로퍼티를 나열하려면 [kotlin.reflect.KClass.properties]를 사용하세요.
```

요소 링크의 이름은 문서화 중인 요소 내부에서 이름이 사용된 것과 동일한 규칙을 사용하여 확인(resolve)됩니다. 특히, 현재 파일에 이름을 임포트했다면 KDoc 주석에서 사용할 때 전체 이름을 다 적을 필요가 없습니다.

KDoc에는 링크에서 오버로드된 멤버를 확인하기 위한 구문이 따로 없습니다. Kotlin의 문서 생성 도구는 함수의 모든 오버로드에 대한 문서를 같은 페이지에 배치하므로, 링크가 작동하기 위해 특정 오버로드 함수를 식별할 필요는 없습니다.

### 외부 링크

외부 링크를 추가하려면 일반적인 Markdown 구문을 사용하세요.

```none
KDoc 구문에 대한 자세한 내용은 [KDoc](<example-URL>)을 참고하세요.
```

## 다음 단계

Kotlin의 문서 생성 도구인 [Dokka](dokka-introduction.md)를 사용하는 방법을 알아보세요.