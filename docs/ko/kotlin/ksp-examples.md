[//]: # (title: KSP 예제)

## 모든 멤버 함수 가져오기 {id="get-all-member-functions"}

```kotlin
fun KSClassDeclaration.getDeclaredFunctions(): Sequence<KSFunctionDeclaration> =
    declarations.filterIsInstance<KSFunctionDeclaration>()
```

## 클래스나 함수가 로컬인지 확인하기 {id="check-whether-a-class-or-function-is-local"}

```kotlin
fun KSDeclaration.isLocal(): Boolean =
    parentDeclaration != null && parentDeclaration !is KSClassDeclaration
```

## 타입 별칭(type alias)이 가리키는 실제 클래스 또는 인터페이스 선언 찾기 {id="find-the-actual-class-or-interface-declaration-that-the-type-alias-points-to"}

```kotlin
fun KSTypeAlias.findActualType(): KSClassDeclaration {
    val resolvedType = this.type.resolve().declaration
    return if (resolvedType is KSTypeAlias) {
        resolvedType.findActualType()
    } else {
        resolvedType as KSClassDeclaration
    }
}
```

## 파일 어노테이션에서 suppress된 이름 수집하기 {id="collect-suppressed-names-in-a-file-annotation"}

```kotlin
// @file:kotlin.Suppress("Example1", "Example2")
fun KSFile.suppressedNames(): Sequence<String> = annotations
    .filter {
        it.shortName.asString() == "Suppress" &&
        it.annotationType.resolve().declaration.qualifiedName?.asString() == "kotlin.Suppress"
    }.flatMap {
        it.arguments.flatMap {
            (it.value as Array<String>).toList()
        }
    }