[//]: # (title: Ant)

> Kotlin 2.2.0부터 Kotlin의 Ant 빌드 시스템 지원은 더 이상 사용되지 않습니다.
> Kotlin 2.3.0에서는 Ant 지원을 제거할 예정입니다.
> 
> 하지만 Ant의 외부 유지보수자가 되는 데 관심이 있다면,
> [이 YouTrack 이슈](https://youtrack.jetbrains.com/issue/KT-75875/)에 댓글을 남겨주세요.
> 
{style="warning"}

## Ant 태스크 가져오기

Kotlin은 Ant를 위한 세 가지 태스크를 제공합니다:

* `kotlinc`: JVM을 대상으로 하는 Kotlin 컴파일러
* `kotlin2js`: JavaScript를 대상으로 하는 Kotlin 컴파일러
* `withKotlin`: 표준 *javac* Ant 태스크를 사용할 때 Kotlin 파일을 컴파일하는 태스크

이러한 태스크는 [Kotlin 컴파일러](%kotlinLatestUrl%) 아카이브의 `lib` 폴더에 있는 *kotlin-ant.jar* 라이브러리에 정의되어 있습니다. Ant 버전 1.8.2 이상이 필요합니다.

## Kotlin 전용 소스로 JVM 대상 지정

프로젝트가 전적으로 Kotlin 소스 코드로 구성된 경우, 프로젝트를 컴파일하는 가장 쉬운 방법은 `kotlinc` 태스크를 사용하는 것입니다:

```xml
<project name="Ant Task Test" default="build">
    <typedef resource="org/jetbrains/kotlin/ant/antlib.xml" classpath="${kotlin.lib}/kotlin-ant.jar"/>

    <target name="build">
        <kotlinc src="hello.kt" output="hello.jar"/>
    </target>
</project>
```

여기서 `${kotlin.lib}`는 Kotlin 독립 실행형 컴파일러가 압축 해제된 폴더를 가리킵니다.

## 여러 소스 루트로 Kotlin 전용 소스를 사용하여 JVM 대상 지정

프로젝트가 여러 소스 루트로 구성된 경우, `src`를 요소로 사용하여 경로를 정의하세요:

```xml
<project name="Ant Task Test" default="build">
    <typedef resource="org/jetbrains/kotlin/ant/antlib.xml" classpath="${kotlin.lib}/kotlin-ant.jar"/>

    <target name="build">
        <kotlinc output="hello.jar">
            <src path="root1"/>
            <src path="root2"/>
        </kotlinc>
    </target>
</project>
```

## Kotlin 및 Java 소스로 JVM 대상 지정

프로젝트가 Kotlin 및 Java 소스 코드로 모두 구성된 경우, `kotlinc`를 사용할 수도 있지만, 태스크 매개변수의 반복을 피하려면 `withKotlin` 태스크를 사용하는 것이 좋습니다:

```xml
<project name="Ant Task Test" default="build">
    <typedef resource="org/jetbrains/kotlin/ant/antlib.xml" classpath="${kotlin.lib}/kotlin-ant.jar"/>

    <target name="build">
        <delete dir="classes" failonerror="false"/>
        <mkdir dir="classes"/>
        <javac destdir="classes" includeAntRuntime="false" srcdir="src">
            <withKotlin/>
        </javac>
        <jar destfile="hello.jar">
            <fileset dir="classes"/>
        </jar>
    </target>
</project>
```

`moduleName` 속성으로 컴파일되는 모듈의 이름을 지정할 수도 있습니다:

```xml
<withKotlin moduleName="myModule"/>
```

## 단일 소스 폴더로 JavaScript 대상 지정

```xml
<project name="Ant Task Test" default="build">
    <typedef resource="org/jetbrains/kotlin/ant/antlib.xml" classpath="${kotlin.lib}/kotlin-ant.jar"/>

    <target name="build">
        <kotlin2js src="root1" output="out.js"/>
    </target>
</project>
```

## Prefix, PostFix 및 sourcemap 옵션으로 JavaScript 대상 지정

```xml
<project name="Ant Task Test" default="build">
    <taskdef resource="org/jetbrains/kotlin/ant/antlib.xml" classpath="${kotlin.lib}/kotlin-ant.jar"/>

    <target name="build">
        <kotlin2js src="root1" output="out.js" outputPrefix="prefix" outputPostfix="postfix" sourcemap="true"/>
    </target>
</project>
```

## 단일 소스 폴더와 metaInfo 옵션으로 JavaScript 대상 지정

`metaInfo` 옵션은 번역 결과를 Kotlin/JavaScript 라이브러리로 배포하려는 경우에 유용합니다.
`metaInfo`를 `true`로 설정하면, 컴파일 중에 바이너리 메타데이터를 포함하는 추가 JS 파일이 생성됩니다. 이 파일은 번역 결과와 함께 배포되어야 합니다:

```xml
<project name="Ant Task Test" default="build">
    <typedef resource="org/jetbrains/kotlin/ant/antlib.xml" classpath="${kotlin.lib}/kotlin-ant.jar"/>

    <target name="build">
        <!-- out.meta.js가 생성되며, 이는 바이너리 메타데이터를 포함합니다. -->
        <kotlin2js src="root1" output="out.js" metaInfo="true"/>
    </target>
</project>
```

## 참조

요소 및 속성의 전체 목록은 다음과 같습니다:

### kotlinc 및 kotlin2js에 공통된 속성

| Name | Description | Required | Default Value |
|------|-------------|----------|---------------|
| `src`  | 컴파일할 Kotlin 소스 파일 또는 디렉토리 | 예 |  |
| `nowarn` | 모든 컴파일 경고를 억제합니다. | 아니요 | false |
| `noStdlib` | Kotlin 표준 라이브러리를 클래스패스에 포함하지 않습니다. | 아니요 | false |
| `failOnError` | 컴파일 중에 오류가 감지되면 빌드를 실패시킵니다. | 아니요 | true |

### kotlinc 속성

| Name | Description | Required | Default Value |
|------|-------------|----------|---------------|
| `output`  | 대상 디렉토리 또는 .jar 파일 이름 | 예 |  |
| `classpath`  | 컴파일 클래스패스 | 아니요 |  |
| `classpathref`  | 컴파일 클래스패스 참조 | 아니요 |  |
| `includeRuntime`  | `output`이 .jar 파일인 경우, Kotlin 런타임 라이브러리를 jar에 포함할지 여부 | 아니요 | true  |
| `moduleName` | 컴파일되는 모듈의 이름 | 아니요 | 대상의 이름 (지정된 경우) 또는 프로젝트 이름 |

### kotlin2js 속성

| Name | Description | Required |
|------|-------------|----------|
| `output`  | 대상 파일 | 예 |
| `libraries`  | Kotlin 라이브러리 경로 | 아니요 |
| `outputPrefix`  | 생성된 JavaScript 파일에 사용할 접두사 | 아니요 |
| `outputSuffix` | 생성된 JavaScript 파일에 사용할 접미사 | 아니요 |
| `sourcemap`  | sourcemap 파일을 생성해야 하는지 여부 | 아니요 |
| `metaInfo`  | 바이너리 디스크립터가 포함된 메타데이터 파일을 생성해야 하는지 여부 | 아니요 |
| `main`  | 컴파일러가 생성한 코드가 `main` 함수를 호출해야 하는지 여부 | 아니요 |

### 원시 컴파일러 인수 전달

사용자 지정 원시 컴파일러 인수를 전달하려면 `value` 또는 `line` 속성 중 하나를 가진 `<compilerarg>` 요소를 사용할 수 있습니다.
이는 `<kotlinc>`, `<kotlin2js>`, `<withKotlin>` 태스크 요소 내에서 다음과 같이 수행할 수 있습니다:

```xml
<kotlinc src="${test.data}/hello.kt" output="${temp}/hello.jar">
    <compilerarg value="-Xno-inline"/>
    <compilerarg line="-Xno-call-assertions -Xno-param-assertions"/>
    <compilerarg value="-Xno-optimize"/>
</kotlinc>
```

사용할 수 있는 전체 인수 목록은 `kotlinc -help`를 실행할 때 표시됩니다.