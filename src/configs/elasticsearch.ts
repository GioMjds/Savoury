import { Client } from '@elastic/elasticsearch';

interface ElasticConfig {
	cloudId: string;
	username: string;
	password: string;
}

const elasticConfig: ElasticConfig = {
	cloudId: process.env.ELASTIC_CLOUD_ID || '',
	username: process.env.ELASTIC_CLOUD_USERNAME || '',
	password: process.env.ELASTIC_CLOUD_PASSWORD || '',
};

export const elasticClient = new Client({
	cloud: {
		id: elasticConfig.cloudId,
	},
	auth: {
		username: elasticConfig.username,
		password: elasticConfig.password,
	},
});
