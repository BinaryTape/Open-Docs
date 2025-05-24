---
title: Ant
---
## Ant 작업 가져오기

Kotlin은 Ant를 위한 세 가지 작업을 제공합니다.

* `kotlinc`: JVM을 대상으로 하는 Kotlin 컴파일러
* `kotlin2js`: JavaScript를 대상으로 하는 Kotlin 컴파일러
* `withKotlin`: 표준 *javac* Ant 작업을 사용할 때 Kotlin 파일을 컴파일하는 작업

이러한 작업은 [Kotlin 컴파일러](https://github.com/JetBrains/kotlin/releases/tag/v2.1.20) 아카이브의 `lib` 폴더에 있는 *kotlin-ant.jar* 라이브러리에 정의되어 있습니다. Ant 버전 1.8.2+가 필요합니다.

## Kotlin 전용 소스로 JVM 타겟팅

프로젝트가 Kotlin 소스 코드로만 구성된 경우 프로젝트를 컴파일하는 가장 쉬운 방법은 `kotlinc` 작업을 사용하는 것입니다.

```xml
<project name="Ant Task Test" default="build">
    <typedef resource="org/jetbrains/kotlin/ant/antlib.xml" classpath="${kotlin.lib}/kotlin-ant.jar"/>

    <target name="build">
        <kotlinc src="hello.kt" output="hello.jar"/>
    </target>
</project>
```

여기서 `${kotlin.lib}`은 Kotlin 독립 실행형 컴파일러가 압축 해제된 폴더를 가리킵니다.

## Kotlin 전용 소스 및 여러 루트로 JVM 타겟팅

프로젝트가 여러 소스 루트로 구성된 경우 `src`를 사용하여 경로를 정의하는 요소로 사용합니다.

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

## Kotlin 및 Java 소스로 JVM 타겟팅

프로젝트가 Kotlin 및 Java 소스 코드로 모두 구성된 경우 `kotlinc`를 사용할 수 있지만 작업 매개변수의 반복을 피하려면 `withKotlin` 작업을 사용하는 것이 좋습니다.

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

`moduleName` 속성으로 컴파일할 모듈의 이름을 지정할 수도 있습니다.

```xml
<withKotlin moduleName="myModule"/>
```

## 단일 소스 폴더로 JavaScript 타겟팅

```xml
<project name="Ant Task Test" default="build">
    <typedef resource="org/jetbrains/kotlin/ant/antlib.xml" classpath="${kotlin.lib}/kotlin-ant.jar"/>

    <target name="build">
        <kotlin2js src="root1" output="out.js"/>
    </target>
</project>
```

## Prefix, PostFix 및 sourcemap 옵션으로 JavaScript 타겟팅

```xml
<project name="Ant Task Test" default="build">
    <taskdef resource="org/jetbrains/kotlin/ant/antlib.xml" classpath="${kotlin.lib}/kotlin-ant.jar"/>

    <target name="build">
        <kotlin2js src="root1" output="out.js" outputPrefix="prefix" outputPostfix="postfix" sourcemap="true"/>
    </target>
</project>
```

## 단일 소스 폴더 및 metaInfo 옵션으로 JavaScript 타겟팅

`metaInfo` 옵션은 변환 결과를 Kotlin/JavaScript 라이브러리로 배포하려는 경우에 유용합니다.
`metaInfo`가 `true`로 설정되면 컴파일 중에 바이너리 메타데이터가 포함된 추가 JS 파일이 생성됩니다. 이 파일은
변환 결과와 함께 배포해야 합니다.

```xml
<project name="Ant Task Test" default="build">
    <typedef resource="org/jetbrains/kotlin/ant/antlib.xml" classpath="${kotlin.lib}/kotlin-ant.jar"/>

    <target name="build">
        <!-- out.meta.js가 생성되며 바이너리 메타데이터를 포함합니다. -->
        <kotlin2js src="root1" output="out.js" metaInfo="true"/>
    </target>
</project>
```

## 참조

전체 요소 및 속성 목록은 아래에 나와 있습니다.

### kotlinc 및 kotlin2js에 공통적인 속성

| Name | Description | Required | Default Value |
|------|-------------|----------|---------------|
| `src`  | 컴파일할 Kotlin 소스 파일 또는 디렉터리 | Yes |  |
| `nowarn` | 모든 컴파일 경고를 표시하지 않음 | No | false |
| `noStdlib` | Kotlin 표준 라이브러리를 클래스 경로에 포함하지 않음 | No | false |
| `failOnError` | 컴파일 중에 오류가 감지되면 빌드를 실패함 | No | true |

### kotlinc 속성

| Name | Description | Required | Default Value |
|------|-------------|----------|---------------|
| `output`  | 대상 디렉터리 또는 .jar 파일 이름 | Yes |  |
| `classpath`  | 컴파일 클래스 경로 | No |  |
| `classpathref`  | 컴파일 클래스 경로 참조 | No |  |
| `includeRuntime`  | `output`이 .jar 파일인 경우 Kotlin 런타임 라이브러리가 jar에 포함되는지 여부 | No | true  |
| `moduleName` | 컴파일할 모듈의 이름 | No | 대상의 이름(지정된 경우) 또는 프로젝트 |

### kotlin2js 속성

| Name | Description | Required |
|------|-------------|----------|
| `output`  | 대상 파일 | Yes |
| `libraries`  | Kotlin 라이브러리 경로 | No |
| `outputPrefix`  | 생성된 JavaScript 파일에 사용할 접두사 | No |
| `outputSuffix` | 생성된 JavaScript 파일에 사용할 접미사 | No |
| `sourcemap`  | 소스 맵 파일을 생성할지 여부 | No |
| `metaInfo`  | 바이너리 설명자가 있는 메타데이터 파일을 생성할지 여부 | No |
| `main`  | 컴파일러 생성 코드가 main 함수를 호출해야 하는지 여부 | No |

### 원시 컴파일러 인수 전달

사용자 정의 원시 컴파일러 인수를 전달하려면 `value` 또는 `line` 속성이 있는 `<compilerarg>` 요소를 사용할 수 있습니다.
다음과 같이 `<kotlinc>`, `<kotlin2js>` 및 `<withKotlin>` 작업 요소 내에서 이를 수행할 수 있습니다.

```xml
<kotlinc src="${test.data}/hello.kt" output="${temp}/hello.jar">
    <compilerarg value="-Xno-inline"/>
    <compilerarg line="-Xno-call-assertions -Xno-param-assertions"/>
    <compilerarg value="-Xno-optimize"/>
</kotlinc>
```

사용할 수 있는 전체 인수 목록은 `kotlinc -help`를 실행할 때 표시됩니다.