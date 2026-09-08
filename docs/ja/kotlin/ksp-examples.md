[//]: # (title: KSP の例)

## すべてのメンバ関数を取得する {id="get-all-member-functions"}

```kotlin
fun KSClassDeclaration.getDeclaredFunctions(): Sequence<KSFunctionDeclaration> =
    declarations.filterIsInstance<KSFunctionDeclaration>()
```

## クラスまたは関数がローカルかどうかを確認する {id="check-whether-a-class-or-function-is-local"}

```kotlin
fun KSDeclaration.isLocal(): Boolean =
    parentDeclaration != null && parentDeclaration !is KSClassDeclaration
```

## 型エイリアスが指し示す実際のクラスまたはインターフェースの宣言を見つける {id="find-the-actual-class-or-interface-declaration-that-the-type-alias-points-to"}

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

## ファイルアノテーション内の抑制された名前を収集する {id="collect-suppressed-names-in-a-file-annotation"}

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