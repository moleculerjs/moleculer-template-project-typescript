import "moleculer"

declare module "moleculer" {
	interface ActionSchema {
		auth?: "required" | null | undefined;
	}
}
